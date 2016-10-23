require('../helper')
const fs = require('fs')

module.exports = async function cat(filePath) {
  return fs.createReadStream(filePath)
}