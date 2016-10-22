require('../helper')
const fs = require('fs').promise
const u = require('../utils')

module.exports = async function updateHandler(req, res, next) {
  const filePath = u.getLocalFilePathFromRequest(req)
  console.log(`Updating ${filePath}`)

  //await fs.writeFile(filePath, request.payload)
  res.end()
}