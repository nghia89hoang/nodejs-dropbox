require('../helper')
const fs = require('fs')

module.exports = async function updateHandler(req, res, next) {
  console.log(`Updating ${req.filePath}`)
  if (req.isDir) {
    res.status(405).send('Path is not a file')
  } else if (req.stat == null) {
    res.status(405).send('File does not exist')
  } else {
    await fs.promise.truncate(req.filePath, 0)
    req.pipe(fs.createWriteStream(req.filePath))
  }
  res.end()
  return Promise.resolve('next')
}
