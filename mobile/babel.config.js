const env = require('./config.js')

module.exports = {
  presets: [ 'module:metro-react-native-babel-preset' ],
  plugins: [[ 'transform-define', env ]]
}
