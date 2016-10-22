require('../helper')
const fs = require('fs').promise
const mkdir = require('../clis/mkdir')
const touch = require('../clis/touch')
const u = require('../utils')

module.exports = async function createHandler(req, res, next) {
  const filePath = u.getLocalFilePathFromRequest(req)
  console.log(`Creating ${filePath}`)

  // const stat = await fs.stat(filePath)
  // await stat.isDirectory() ? mkdir(filePath) : touch(filePath)
  res.end()
}