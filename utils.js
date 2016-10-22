const path = require('path')

module.exports = {
  getLocalFilePathFromRequest: function(request) {
    return path.join(process.cwd(), 'files', request.url)
  }
} 