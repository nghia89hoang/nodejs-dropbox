require('../helper')
const fs = require('fs').promise
const cat = require('../clis/cat')
const u = require('../utils')

module.exports = async function readHandler(req, res, next) {
  const filePath = u.getLocalFilePathFromRequest(req)
  console.log(`Reading ${filePath}`)

  // cat(filePath)
  res.end()
}