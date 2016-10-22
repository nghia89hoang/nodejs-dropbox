require('../helper')
const fs = require('fs').promise
const u = require('../utils')

module.exports = async function sendHeaders(req, res, next) {
  const filePath = u.getLocalFilePathFromRequest(req)
  console.log(`SendHeaders ${filePath}`)
  next()
}