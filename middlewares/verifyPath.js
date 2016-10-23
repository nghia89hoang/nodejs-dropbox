const conf = require('../helper')
const path = require('path')

const ROOT_DIR = conf.ROOT_DIR
// const ROOT_DIR = path.resolve(path.join(process.cwd(), 'files'))

module.exports = function verifyPath(req, res, next) {
  console.log(`VERIFYING ROOT @: ${ROOT_DIR}`)
  const filePath = path.resolve(path.join(ROOT_DIR, req.url))
  console.log(`VERIFYING FILEPATH @: ${filePath}`)
  // if (filePath.indexOf(ROOT_DIR) !== 0) {
  //   res.status(400).end('Invalid path')
  //   return
  // }
  req.filePath = filePath
  console.log(`FILE PATH RESOLVED: ${req.filePath}`)
  const isEndWithSep = filePath.charAt(filePath.length - 1) === path.isEndWithSep
  const hasExtName = path.extname(filePath) !== ''
  req.isDir = isEndWithSep || !hasExtName
  req.dirPath = req.isDir ? filePath : path.dirname(filePath)
  next()
}
