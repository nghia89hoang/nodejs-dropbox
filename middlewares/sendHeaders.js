require('../helper')
// const fs = require('fs').promise
const path = require('path')
const mime = require('mime-types')

module.exports = async function sendHeaders(req, res, next) {
  const filePath = req.filePath
  let contentType = mime.contentType(path.extname(filePath)) || 'application/json'
  if (!req.stat) {
    console.log('Invalid stat, Can not set header for non-existed file')
    return Promise.resolve('next')
  }
  if (req.stat.isDirectory()) {
    if (req.headers.accept && req.headers.accept.indexOf('application/x-gtar') >= 0) {
      contentType = 'application/zip'
    }
  }
  res.set('Content-Type', contentType)
  return Promise.resolve('next')
}
