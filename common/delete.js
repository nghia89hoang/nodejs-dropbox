require('../helper')
const rimraf = require('rimraf')

module.exports = async function create(filePath, isDir, content) {
  return rimraf.promise(filePath)
}
