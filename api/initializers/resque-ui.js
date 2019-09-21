const auth = require('basic-auth')
const { api, Initializer } = require('actionhero')

module.exports = class ResqueUI extends Initializer {
  constructor () {
    super()
    this.name = 'resque-ui'
  }

  async start () {
    const resqueUIAuthMiddleware = {
      name: 'resque-ui-auth-middleware',
      global: false,
      priority: 1000,
      preProcessor: async ({ connection }) => {
        const correctPassword = api.config['ah-resque-ui'].password
        const credentials = auth(connection.rawConnection.req)
        if (!credentials || credentials.pass !== correctPassword) {
          connection.rawConnection.res.statusCode = 401
          connection.rawConnection.res.setHeader('WWW-Authenticate', 'Basic realm="Actionhero Resque UI"')
          connection.rawConnection.res.end('Access denied')
          return false
        }
      }
    }

    api.actions.addMiddleware(resqueUIAuthMiddleware)
  }
}
