require('../helper')
const fs = require('fs')

module.exports = async function readHandler(req, res) {
  const filePath = req.filePath
  const isDir = req.isDir
  console.log(`Reading ${filePath}`)
  if (!req.stat) {
    res.status(400).send('Can not query non-existed files')
  }
  if (isDir) {
    fs.promise.readdir(filePath).then(files => {
      res.json(JSON.stringify(files))
    }, err => {
      res.status(500).send('Internal Err: can not list dir content!!!')
    })
  } else {
    const readStream = fs.createReadStream(filePath)
    readStream.pipe(res)
  }
}
