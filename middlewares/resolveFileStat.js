require('../helper')
const fs = require('fs')

// Resolve file Stats:
//  * If exist -> return stat
//  * Otherwiese -> null
module.exports = async function resolveFileStat(req, res, next) {
  if (!req.filePath) {
    console.log(`Error @:${__filename}, need verifyPath first`)
  }
  return fs.promise.stat(req.filePath).then(stat => {
    console.log(`FILE EXISTED WITH STAT: ${stat}`)
    req.stat = stat
  }, err => {
    console.log('FAILED to get STATS')
    req.stat = null
  }).then(dummy => {
    // console.log(`${__filename} RESOLVING TO NEXT STEP...`)
    return Promise.resolve('next')
  })
  // ***********************
  // const stat = await fs.promise.stat(filePath)
  // req.stat = stat
}
