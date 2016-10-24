require('../helper')
const fs = require('fs')
const archiver = require('archiver')

module.exports = async function readHandler(req, res, next) {
  const filePath = req.filePath
  const isDir = req.isDir
  let contentLength = 0
  console.log(` HTTP Reading ${filePath}`)
  if (!req.stat) {
    res.status(400).send('File not found')
  } else if (!isDir) {
    console.log(` Streaming ${filePath} ...`)
    contentLength = req.stat.size
    fs.createReadStream(filePath).pipe(res)
    res.set('Content-Length', contentLength)
  } else {
    const acceptHeader = req.headers.accept
    if (acceptHeader && acceptHeader.indexOf('application/x-gtar') >= 0) {
      console.log('Zipping...')
      const archive = archiver('zip')
      // res.set('Content-Type', 'application/x-gtar')
      archive.bulk([
        { expand: true, cwd: filePath, src: ['**'], dest: '.' }
      ])
      archive.pipe(res)
      archive.finalize()
      Promise.resolve('next')
    } else {
      console.log('Listing ...')
      const files = await fs.promise.readdir(filePath)
      res.body = JSON.stringify(files)
      contentLength = res.body.length
      res.set('Content-Length', contentLength)
      res.json(res.body)
    }
  }
  Promise.resolve('next')
}
