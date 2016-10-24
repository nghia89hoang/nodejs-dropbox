require('../helper')
const fs = require('fs')
const archiver = require('archiver')
const mkdirp = require('mkdirp')
const path = require('path')

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
      console.log('HEADERS: ' + req.get('accept'))
      if (req.get('Content-Type') !== 'application/zip') {
        console.log('Saving new content...')
        const writeStream = fs.createWriteStream(req.filePath)
        req.pipe(writeStream)
        writeStream.on('finish', () => {
          onCreate(req.filePath, req.isDir)
        })
      } else {
        console.log('Compressing data...')
        const writeStream = fs.createWriteStream(req.filePath + '.zip')
        const archive = archiver('zip')
        archive.append(req, { name: path.basename(req.filePath) })
        archive.pipe(writeStream)
        archive.finalize()
        writeStream.on('finish', () => {
          onCreate(req.filePath, req.isDir)
        })
      }
    }
    return Promise.resolve('next')
  }
}

