require('../helper')
const rimraf = require('rimraf')

module.exports = function deleteHandler(onDelete) {
  return async(req, res, next) => {
    const filePath = req.filePath
    console.log(` HTTP Deleting ${filePath}`)
    if (req.stat == null) {
      res.status(405).send('File does not exist')
    }
    rimraf.promise(filePath).then(dummy => {
      onDelete(req.filePath, req.isDir)
    })
    return Promise.resolve('next')
  }
}
