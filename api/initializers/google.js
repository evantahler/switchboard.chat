const { api, Initializer } = require('actionhero')
const { OAuth2Client } = require('google-auth-library')

module.exports = class GoogleInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'google'
  }

  async initialize () {
    // https://developers.google.com/identity/sign-in/web/backend-auth
    api.google = {
      client: new OAuth2Client(api.config.google.apiKey),
      authenticate: async (email, idToken) => {
        const ticket = await api.google.client.verifyIdToken({ idToken: idToken }) // this will throw if something went wrong
        const payload = ticket.getPayload()
        if (payload.email !== email) { throw new Error('Google Authentication Error: email missmatch') }
        return payload
      }
    }
  }
}
