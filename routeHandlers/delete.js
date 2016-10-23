require('../helper')
const rimraf = require('rimraf')

module.exports = async function deleteHandler(req, res, next) {
  const filePath = req.filePath
  console.log(`Deleting ${filePath}`)
  if (req.stat == null) {
    res.status(405).send('File does not exist')
  }
  await rimraf.promise(filePath)
  res.end()
  return Promise.resolve('next')
}