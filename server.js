#!/usr/bin/env babel-node

const conf = require('./helper')

const express = require('express')
const morgan = require('morgan')
// const bodyParser = require('body-parser')
// const router = express.Router()
const router = require('express-promise-router')()
const nssocket = require('nssocket')
const chokidar = require('chokidar')
// ------------------------------ MIDDLEWARES
const verifyPath = require('./middlewares/verifyPath')
const resolveFileStat = require('./middlewares/resolveFileStat')
const sendHeaders = require('./middlewares/sendHeaders')
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

function tcpSync(action) {
  const syncImpl = (filePath, isDir) => {
    const messages = {
      action,
      path: filePath,
      type: isDir ? 'dir' : 'file',
      updated: Date.now()
    }
    for (const c of clients) {
      console.log(`SENDING ${messages}`)
      c.send('SYNC', messages)
    }
  }
  return syncImpl
}

const tcpSyncWrite = () => tcpSync('write')

const tcpSyncDelete = () => tcpSync('delete')

async function main() {
  const httpServer = express()
  if (NODE_ENV === 'development') {
    httpServer.use(morgan('dev'))
  }
  // ** ROUTING ***************
  // const dispatchAllUser = dispatchTCP(clients)
  httpServer.use(router)
  router.head('*', verifyPath, resolveFileStat, sendHeaders, end)
  router.get('*', verifyPath, resolveFileStat, sendHeaders, readHandler, end)
  router.put('*', verifyPath, resolveFileStat, createHandler(tcpSyncWrite()), end)
  router.post('*', verifyPath, resolveFileStat, updateHandler(tcpSyncWrite()), end)
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
    socket.send('ServerCall', 'Chim se goi dai bang')
    socket.data('Connecting', (data) => {
      console.log(`There are ${clients.length} client(s) connected`)
    })
  })
  tcpServer.listen(TCP_PORT)
  console.log(`TCP LISTENING @ http://127.0.0.1:${TCP_PORT}`)
  // ********************************* CHOKIDAR
  const watcher = chokidar.watch(ROOT_DIR, { ignored: /[\/\\]\./ })
  watcher
    .on('addDir', onAddDir)
    .on('unlinkDir', onUnlinkDir)
    .on('add', onAdd)
    .on('change', onChange)
    .on('unlink', onUnlink)
}

function onAddDir(path) {

}
function onUnlinkDir(path) {

}
function onAdd(path) {

}
function onChange(path) {

}
function onUnlink(path) {

}

main()
