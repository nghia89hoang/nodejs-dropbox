require('../helper')
const fs = require('fs').promise
const path = require('path')
const mime = require('mime-types')

module.exports = async function sendHeaders(req, res, next) {
  const filePath = req.filePath
  const contentType = mime.contentType(path.extname(filePath)) || 'application/json'
  let size = 0
  if (!req.stat) {
    console.log('Invalid stat, Can not set header for non-existed file')
    return Promise.resolve('next')
  }
  if (req.stat.isDirectory()) {
    const files = await fs.readdir(filePath)
    res.body = JSON.stringify(files)
    size = res.body.length
  } else {
    size = req.stat.size
  }
  const headers = {
    'Content-Type': contentType,
    'Content-Length': size
  }
  console.log(`HEADER SET: ${JSON.stringify(headers)}`)
  res.set(headers)
  return Promise.resolve('next')
}
