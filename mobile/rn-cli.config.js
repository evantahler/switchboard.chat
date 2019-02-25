const path = require('path')

module.exports = {
  projectRoot: path.resolve(__dirname),
  watchFolders: [
    path.resolve(__dirname, '../web/components'),
    path.resolve(__dirname, '../web/repositories'),
    path.resolve(__dirname, '../web/client'),
    path.resolve(__dirname, '../web'),
    path.resolve(__dirname, '../node_modules')
  ]
}
