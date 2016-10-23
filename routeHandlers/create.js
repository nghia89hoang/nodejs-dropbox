require('../helper')
const fs = require('fs')
const mkdirp = require('mkdirp')

// const mkdir = require('../clis/mkdir')
// const touch = require('../clis/touch')

module.exports = async function createHandler(req, res, next) {
  console.log(`Creating ${req.filePath}`)
  if (req.stat != null) {
    console.log('File existed !!!')
    res.status(405).end('Method not allowed: file existed')
    return Promise.resolve('route')
  }
  await mkdirp.promise(req.dirPath)
  if (!req.isDir) {
    console.log('Streamming content...')
    req.pipe(fs.createWriteStream(req.filePath))
  }
  res.end()
  return Promise.resolve('next')
}

