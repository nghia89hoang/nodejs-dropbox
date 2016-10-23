require('../helper')
const rimraf = require('rimraf')

module.exports = function deleteHandler(onDelete) {
  return async(req, res, next) => {
    const filePath = req.filePath
    console.log(`Deleting ${filePath}`)
    if (req.stat == null) {
      res.status(405).send('File does not exist')
    }
    rimraf.promise(filePath).then(dummy => {
      console.log('CALL TCP SYNC DEL')
      onDelete(req.filePath, req.isDir)
    })
    return Promise.resolve('next')
  }
}
