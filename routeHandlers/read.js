require('../helper')
const fs = require('fs')
const archiver = require('archiver')

module.exports = function readHandler(req, res, next) {
  const filePath = req.filePath
  const isDir = req.isDir
  console.log(`Reading ${filePath}`)
  if (!req.stat) {
    res.status(400).end('Can not query non-existed files')
  }
  if (!isDir) {
    console.log(` Streaming ${filePath} ...`)
    fs.createReadStream(filePath).pipe(res)
  } else {
    console.log('ELSE')
    const acceptHeader = req.headers.accept
    if (acceptHeader && acceptHeader.indexOf('application/x-gtar') >= 0) {
      console.log('Zipping...')
      const archive = archiver('zip')
      res.set('Content-Type', 'application/x-gtar')
      archive.pipe(res)
      archive.bulk([
        { expand: true, cwd: 'source', src: ['**'], dest: 'source' }
      ])
      archive.finalize()
    } else {
      console.log('Listing ...')
      res.json(res.body).end()
      next()
    }
  }
}
