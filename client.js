const conf = require('./helper')

const nssocket = require('nssocket')
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const request = require('request')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const unzip = require('unzip2')

// const ROOT_DIR = conf.ROOT_DIR
const CLIENT_DIR = conf.CLIENT_DIR
const TCP_PORT = conf.TCP_PORT
const HTTP_PORT = conf.HTTP_PORT
const SERVER = conf.SERVER
const HTTP_SERVER_URL = `http://${SERVER}:${HTTP_PORT}`

async function main() {
  const socket = new nssocket.NsSocket()
  socket.connect(TCP_PORT, SERVER)
  socket.data('SYNC_ALL', (data) => {
    console.log('Sync full using zip')
    const options = {
      url: HTTP_SERVER_URL,
      headers: { Accept: 'application/x-gtar' }
    }
    const readStream = request.get(options)
    readStream.pipe(unzip.Extract({ path: CLIENT_DIR }))
  })
  socket.data('SYNC', async (data) => {
    const filePath = path.resolve(path.join(CLIENT_DIR, data.path))
    console.log(`ACTION: ${data.action} -> PATH: ${filePath}`)
    if (!data) {
      return
    }
    switch (data.action) {
      case 'write':
      case 'create':
      case 'update':
        if (data.isDir) {
          mkdirp.promise(filePath)
        } else {
          const dirPath = path.dirname(filePath)
          await mkdirp.promise(dirPath)
          const writeStream = fs.createWriteStream(filePath)
          request.get(`${HTTP_SERVER_URL}/${data.path}`).pipe(writeStream)
        }
        break
      case 'delete':
        await rimraf.promise(filePath)
        break
      default:
        console.log(`UNSUPPORTED ACTION: ${data.action}`)
    }
  })
  socket.send('Connecting', { client: '123' })
}

main()
