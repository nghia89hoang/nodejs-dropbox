require('../helper')

module.exports = async function end(req, res) {  
  console.log(`Ending`)  
  res.end()
}