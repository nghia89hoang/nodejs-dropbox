#!/usr/bin/env babel-node

const conf = require('./helper')

const express = require('express')
const morgan = require('morgan')
// const bodyParser = require('body-parser')
// const router = express.Router()
const router = require('express-promise-router')()
const nssocket = require('nssocket')
const chokidar = require('chokidar')
const path = require('path')
// ------------------------------ MIDDLEWARES
const verifyPath = require('./middlewares/verifyPath')
const resolveFileStat = require('./middlewares/resolveFileStat')
const resolveHeaders = require('./middlewares/resolveHeaders')
const end = require('./middlewares/end')
// const dispatchTCP = require('./middlewares/dispatchTCP')

const createHandler = require('./routeHandlers/create')
const readHandler = require('./routeHandlers/read')
const deleteHandler = require('./routeHandlers/delete')
const updateHandler = require('./routeHandlers/update')

const NODE_ENV = process.env.NODE_ENV
const HTTP_PORT = process.env.PORT || conf.HTTP_PORT
const TCP_PORT = conf.TCP_PORT
const ROOT_DIR = conf.ROOT_DIR

const clients = []
const stagedFiles = []
// actionSrc = 'HTTP' or 'WATCH'
function tcpSync(action, actionSrc = 'HTTP') {
  const syncImpl = (filePath, isDir) => {
    const relativePath = path.relative(ROOT_DIR, filePath)
    const pair = action + ':' + relativePath
    // For HTTP : already fired TCP
    if (actionSrc === 'HTTP') {
      stagedFiles.push(pair)
    }
    if (actionSrc === 'WATCH') {
      const idx = stagedFiles.indexOf(pair)
      if (idx !== -1) {
        console.log(`DUPLICATED ${action} ON ${filePath}`)
        stagedFiles.splice(idx, 1)
        return
      }
    }
    console.log(`TCP ${action} ON FILES: ${filePath}`)
    const messages = {
      action,
      path: relativePath,
      type: isDir ? 'dir' : 'file',
      updated: Date.now()
    }
    for (const c of clients) {
      c.send('SYNC', messages)
    }
  }
  return syncImpl
}

const tcpSyncCreate = () => tcpSync('create')

const tcpSyncUpdate = () => tcpSync('update')

const tcpSyncDelete = () => tcpSync('delete')

async function main() {
  const httpServer = express()
  if (NODE_ENV === 'development') {
    httpServer.use(morgan('dev'))
  }
  // ** ROUTING ***************
  // const dispatchAllUser = dispatchTCP(clients)
  httpServer.use(router)
  router.head('*', verifyPath, resolveFileStat, resolveHeaders, end)
  router.get('*', verifyPath, resolveFileStat, resolveHeaders, readHandler, end)
  router.put('*', verifyPath, resolveFileStat, resolveHeaders, createHandler(tcpSyncCreate()), end)
  router.post('*', verifyPath, resolveFileStat, updateHandler(tcpSyncUpdate()), end)
  router.delete('*', verifyPath, resolveFileStat, deleteHandler(tcpSyncDelete()), end)
              // ** ERR HANDLE ************
  httpServer.use((err, req, res, next) => {
    console.error(`[App]Internal error caucht with stack trace: ${err.stack}`)
    res.status(500).end(`Server internal error:${err.message}`)
  })
  await httpServer.promise.listen(HTTP_PORT)
  console.log(`LISTENING @ http://127.0.0.1:${HTTP_PORT}`)
  // ********************************* TCP
  const tcpServer = nssocket.createServer((socket) => {
    clients.push(socket)
    socket.send('SYNC_ALL', '')
    socket.data('Connecting', (data) => {
      console.log(`There are ${clients.length} client(s) connected`)
    })
  })
  tcpServer.listen(TCP_PORT)
  console.log(`TCP LISTENING @ http://127.0.0.1:${TCP_PORT}`)
  // ********************************* CHOKIDAR
  const watcher = chokidar.watch(ROOT_DIR, {
    ignored: /[\/\\]\./,
    ignoreInitial: true
  })
  watcher
    .on('addDir', onAddDir)
    .on('unlinkDir', onUnlinkDir)
    .on('add', onAdd)
    .on('change', onChange)
    .on('unlink', onUnlink)
}

function onAddDir(abspath) {
  // console.log(`add dir ${abspath}`)
  const relativePath = abspath
  tcpSync('create', 'WATCH')(relativePath, true)
}
function onUnlinkDir(abspath) {
  console.log(`rmv dir ${abspath}`)
  const relativePath = abspath
  tcpSync('delete', 'WATCH')(relativePath, true)
}
function onAdd(abspath) {
  console.log(`add file ${abspath}`)
  const relativePath = abspath
  tcpSync('create', 'WATCH')(relativePath, false)
}
function onChange(abspath) {
  console.log(`upd file ${abspath}`)
  const relativePath = abspath
  tcpSync('update', 'WATCH')(relativePath, false)
}
function onUnlink(abspath) {
  console.log(`rmv file ${abspath}`)
  const relativePath = abspath
  tcpSync('delete', 'WATCH')(relativePath, false)
}

main()
