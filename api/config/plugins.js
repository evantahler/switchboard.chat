const path = require('path')

exports['default'] = {
  plugins: (api) => {
    return {
      'ah-sequelize-plugin': { path: path.join(__dirname, '..', '..', 'node_modules', 'ah-sequelize-plugin') },
      'ah-newrelic-plugin': { path: path.join(__dirname, '..', '..', 'node_modules', 'ah-newrelic-plugin') },
      'ah-resque-ui': { path: path.join(__dirname, '..', '..', 'node_modules', 'ah-resque-ui') },
    }
  }
}
