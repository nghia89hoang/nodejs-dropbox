require('../helper')
const fs = require('fs').promise
const rm = require('../clis/rm')

module.exports = async function deleteHandler(req, res, next) {
  const filePath = req.filePath
  console.log(`Deleting ${filePath}`)

  // await rm(filePath)
  res.end()
}