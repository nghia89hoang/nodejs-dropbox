#!/usr/bin/env babel-node

require('./helper')

const express = require('express')
const morgan = require('morgan')
// const bodyParser = require('body-parser')
// const router = express.Router()
const router = require('express-promise-router')()

const verifyPath = require('./middlewares/verifyPath')
const resolveFileStat = require('./middlewares/resolveFileStat')
const sendHeaders = require('./middlewares/sendHeaders')
const end = require('./middlewares/end')

const createHandler = require('./routeHandlers/create')
const readHandler = require('./routeHandlers/read')
const deleteHandler = require('./routeHandlers/delete')
const updateHandler = require('./routeHandlers/update')

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 8000

async function main() {
  const httpServer = express()
  if (NODE_ENV === 'development') {
    httpServer.use(morgan('dev'))
  }
  // ** ROUTING ***************
  httpServer.use(router)
  router.head('*', verifyPath, resolveFileStat, sendHeaders, end)
  router.get('*', verifyPath, resolveFileStat, sendHeaders, readHandler)
  router.put('*', verifyPath, resolveFileStat, createHandler)
  router.post('*', verifyPath, resolveFileStat, updateHandler)
  router.delete('*', verifyPath, resolveFileStat, deleteHandler)
  // ** ERR HANDLE ************
  httpServer.use((err, req, res, next) => {
    console.error(`[App]Internal error caucht with stack trace: ${err.stack}`)
    res.status(500).end(`Server internal error:${err.message}`)
  })
  // **************************
  await httpServer.promise.listen(PORT)
  console.log(`LISTENING @ http://127.0.0.1:${PORT}`)
}

main()
