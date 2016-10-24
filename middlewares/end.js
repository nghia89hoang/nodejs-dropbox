require('../helper')

module.exports = async function end(req, res) {
  console.log('------------- ENDING HTTP -------------')
  res.end()
}