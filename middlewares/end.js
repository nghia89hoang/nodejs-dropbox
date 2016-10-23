require('../helper')

module.exports = async function end(req, res) {
  console.log('Response Ending')  
  res.end()
}