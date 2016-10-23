require('../helper')
const fs = require('fs')
const mkdirp = require('mkdirp')

// const mkdir = require('../clis/mkdir')
// const touch = require('../clis/touch')

module.exports = async function updateHandler(req, res, next) {
  console.log(`Creating ${req.filePath}`)
  await mkdirp.promise(req.dirPath)
  if (!req.isDir) {
    if (req.stat === null) {
      console.log('Streamming content...')
      req.pipe(fs.createWriteStream(req.filePath))
    } else {
      res.status(405).send('Method not allowed: file existed')
    }
  }
  // safe to end here ???
  res.end()
}
