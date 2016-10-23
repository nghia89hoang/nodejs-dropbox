require('../helper')
const fs = require('fs')

module.exports = function updateHandler(onUpdate) {
  return async(req, res, next) => {
    console.log(`Updating ${req.filePath}`)
    if (req.isDir) {
      res.status(405).send('Path is not a file')
    } else if (req.stat == null) {
      res.status(405).send('File does not exist')
    } else {
      await fs.promise.truncate(req.filePath, 0)
      const writeStream = fs.createWriteStream(req.filePath)
      req.pipe(writeStream)
      writeStream.on('finish', () => {
        console.log('CALL TCP SYNC UPDATE')
        onUpdate(req.filePath, req.isDir)
      })
    }
    return Promise.resolve('next')
  }
}
