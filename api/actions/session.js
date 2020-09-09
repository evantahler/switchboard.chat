const { Action, api } = require('actionhero')

exports.sessionCreate = class sessionCreate extends Action {
  constructor () {
    super()
    this.name = 'session:create'
    this.description = 'to create a session'
    this.outputExample = {}
  }

  inputs () {
    return {
      email: { required: true },
      password: { required: false },
      idToken: { required: false }
    }
  }

  async run ({ connection, response, params }) {
    response.success = false

    const user = await api.models.User.findOne({ where: { email: params.email } })
    if (!user) { throw new Error('user not found') }

    if (params.password) {
      const match = await user.checkPassword(params.password)
      if (!match) { throw new Error('password does not match') }
    } else if (params.idToken) {
      await api.google.authenticate(params.email, params.idToken)
    } else {
      throw new Error('either password or idToken is required to authenticate')
    }

    const sessionData = await api.session.create(connection, user)
    response.userId = user.id
    response.success = true
    response.csrfToken = sessionData.csrfToken
  }
}

exports.sessionDestroy = class sessionDestroy extends Action {
  constructor () {
    super()
    this.name = 'session:destroy'
    this.description = 'to destroy a session'
    this.outputExample = {}
  }

  async run ({ connection, response }) {
    response.success = false
    await api.session.destroy(connection)
    response.success = true
  }
}
