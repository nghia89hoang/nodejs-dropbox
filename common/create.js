require('../helper')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const stream = require('stream')

module.exports = async function create(filePath, isDir, content) {
  if (isDir) {
    mkdirp.promise(filePath)
  } else {
    const dirPath = path.dirname(filePath)
    await mkdirp.promise(dirPath)
    if (content instanceof stream.Readble) {
      // console.log('Streamming content...')
      const writeStream = fs.createWriteStream(filePath)
      content.pipe(writeStream)
    }
  }
}
