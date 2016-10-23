const conf = require('./helper')

const nssocket = require('nssocket')
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

const ROOT_DIR = conf.ROOT_DIR
const TCP_PORT = conf.TCP_PORT
const SERVER = conf.SERVER

function main() {
  const socket = new nssocket.NsSocket()
  socket.connect(TCP_PORT, SERVER)
  socket.data('ServerCall', (data) => {
    console.log(`Call what? ${data}`)
  })
  socket.data('SYNC', (data) => {
    // console.log(`SYNC ... ${data}`)
    console.log('SYNC...')
  })
  socket.send('Connecting', { client: '123' })
}

main()
