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
    // fs.createReadStream(filePath).promise.pipe(res).then(dummy => {
    //   next()
    // })
  } else {
    // const acceptHeader = req.headers.accept
    // if (acceptHeader && acceptHeader.indexOf('application/x-gtar') >= 0) {
    // console.log(`Response Header: ${res.get('Content-Type')}`)
    if (res.get('Content-Type') === 'application/zip') {
      console.log('Compressing content ...')
      const archive = archiver('zip')
      archive.bulk([
        { expand: true, cwd: filePath, src: ['**'], dest: '.' }
      ])
      archive.pipe(res)
      archive.finalize()
    } else {
      console.log('Listing ...')
      const files = await fs.promise.readdir(filePath)
      res.body = JSON.stringify(files)
      contentLength = res.body.length
      res.set('Content-Length', contentLength)
      res.json(res.body)
    }
    Promise.resolve('next')
  }
}
