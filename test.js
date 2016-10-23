require('./helper')
const fs = require('fs')
const util = require('util')
const path = require('path')
const nssocket = require('nssocket')

const argv = process.argv
const dir = argv[2]
console.log(`WORKING ON: ${dir}`)
function touch(filePath) {
  fs.mkdir(filePath, (err) => {
    console.log(err)
  })
}

async function statFolder(filePath) {
  const stat = await fs.promise.stat(filePath)
  const statStr = util.inspect(stat)
  console.log(statStr)
}

// touch(dir)

// statFolder(dir)

function testNssocket() {
  const server = nssocket.createServer((socket) => {
    
  })
  console.log(`SERVER: ${JSON.stringify(server)}`)
  server.listen(8000)
}

testNssocket()
