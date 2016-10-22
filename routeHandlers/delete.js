require('../helper')
const fs = require('fs').promise
const rm = require('../clis/rm')
const u = require('../utils')

module.exports = async function deleteHandler(req, res, next) {
  const filePath = u.getLocalFilePathFromRequest(req)
  console.log(`Deleting ${filePath}`)

  // await rm(filePath)
  res.end()
}