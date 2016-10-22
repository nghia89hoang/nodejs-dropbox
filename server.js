#!/usr/bin/env babel-node

require('./helper')

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = express.Router()

const createHandler = require('./routeHandlers/create')
const readHandler = require('./routeHandlers/read')
const deleteHandler = require('./routeHandlers/delete')
const updateHandler = require('./routeHandlers/update')
const sendHeaders = require('./routeHandlers/sendHeaders')
const end = require('./routeHandlers/end')

async function main() {
  const httpServer = express()
  httpServer.use(morgan('dev'))
  // ** ROUTING ***************
  httpServer.use(router)
  router.head('*', sendHeaders, end)
  router.get('*', sendHeaders, readHandler)
  router.put('*', bodyParser.raw(), createHandler)
  router.post('*', bodyParser.raw(), updateHandler)
  router.delete('*', deleteHandler)
  // ** ERR HANDLE ************
  httpServer.use((err, req, res, next) => {
    console.error(`Internal error caucht with stack trace: ${err.stack}`)
    res.status(500).end(`Server internal error:${err.msg}`)
  })
  // **************************
  const port = 8000
  await httpServer.promise.listen(port)   
  console.log(`LISTENING @ http://127.0.0.1:${port}`)
}

main()
