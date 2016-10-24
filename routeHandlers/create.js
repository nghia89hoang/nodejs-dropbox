require('../helper')
const fs = require('fs')
const mkdirp = require('mkdirp')

// const mkdir = require('../clis/mkdir')
// const touch = require('../clis/touch')

module.exports = function createHandler(onCreate) {
  return async(req, res, next) => {
    console.log(` HTTP Creating ${req.filePath}`)
    if (req.stat != null) {
      console.log('File existed !!!')
      res.status(405).send('Method not allowed: file existed')
    } else if (req.isDir) {
      await mkdirp.promise(req.dirPath)
      onCreate(req.dirPath, req.isDir)
    } else {
      await mkdirp.promise(req.dirPath)
      console.log('Saving new content...')
      const writeStream = fs.createWriteStream(req.filePath)
      req.pipe(writeStream)
      writeStream.on('finish', () => {
        onCreate(req.filePath, req.isDir)
      })
    }
    return Promise.resolve('next')
  }
}

