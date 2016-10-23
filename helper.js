require('songbird')
const path = require('path')

const defaultRoot = path.resolve(path.join(process.cwd(), 'files'))

const argv = require('yargs')
                      .default('dir', defaultRoot)
                      .argv

const dir = argv.dir

const config = {
  ROOT_DIR: dir,
  HTTP_PORT: 8000,
  TCP_PORT: 8001,
  SERVER: '127.0.0.1'
}
module.exports = config

// *****
function logError(err) {
  console.log(err.stack)
}

process.on('uncaughtException', logError)
process.on('uncaughtApplicationException', logError)
process.on('unhandledRejection', logError)