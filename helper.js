require('songbird')
const path = require('path')
const argv = require('yargs')
                      .argv

const defaultRoot = path.resolve(path.join(process.cwd(), 'files'))
const dir = argv.dir || defaultRoot

const config = {
  ROOT_DIR: dir
}
module.exports = config

// *****
function logError(err) {
  console.log(err.stack)
}

process.on('uncaughtException', logError)
process.on('uncaughtApplicationException', logError)
process.on('unhandledRejection', logError)
