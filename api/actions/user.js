const { Action, api } = require('actionhero')
const validator = require('validator')
const { parsePhoneNumber } = require('libphonenumber-js')

exports.userCreate = class userCreate extends Action {
  constructor () {
    super()
    this.name = 'user:create'
    this.description = 'to create a user'
    this.outputExample = {}
  }

  inputs () {
    return {
      firstName: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      lastName: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      email: {
        required: true,
        validator: s => { return validator.isEmail(s) }
      },
      password: {
        required: false,
        validator: s => { return validator.isLength(s, { min: api.models.User.minPasswordLength }) }
      },
      idToken: {
        required: false
      },
      phoneNumber: {
        required: false,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ connection, response, params }) {
    if (!params.password && !params.idToken) { throw new Error('either password or idToken is required to create a new user') }

    if (params.idToken) {
      await api.google.authenticate(params.email, params.idToken)
    }

    const existingUser = api.models.User.findOne({ where: { email: params.email } })
    if (existingUser) { throw new Error('this email already is registered to a Switchboard account.  Try logging in!') }

    const user = new api.models.User(params)
    await user.save()

    if (params.password) {
      await user.updatePassword(params.password)
    }

    await api.session.create(connection, user)
    response.user = user.apiData()
  }
}

exports.userView = class userView extends Action {
  constructor () {
    super()
    this.name = 'user:view'
    this.description = 'to view a user'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  inputs () {
    return {}
  }

  async run ({ response, session }) {
    const user = await api.models.User.findOne({ where: { id: session.userId } })
    response.user = user.apiData()
  }
}

exports.userEdit = class userEdit extends Action {
  constructor () {
    super()
    this.name = 'user:edit'
    this.description = 'to edit a user'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  inputs () {
    return {
      firstName: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      lastName: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      email: {
        required: false,
        validator: s => { return validator.isEmail(s) }
      },
      password: {
        required: false,
        validator: s => { return validator.isLength(s, { min: api.models.User.minPasswordLength }) }
      },
      phoneNumber: {
        required: false,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ response, params, session }) {
    let user = await api.models.User.findOne({ where: { id: session.userId } })
    user = Object.assign(user, params)
    await user.save()
    if (params.password) {
      await user.updatePassword(params.password)
    }
    response.user = user.apiData()
  }
}

exports.userRequestResetPassword = class userRequestResetPassword extends Action {
  constructor () {
    super()
    this.name = 'user:requestResetPassword'
    this.description = 'to request a password reset email for a user'
    this.outputExample = {}
    this.middleware = []
  }

  inputs () {
    return {
      email: {
        required: true,
        validator: s => { return validator.isEmail(s) }
      }
    }
  }

  async run ({ response, params }) {
    const user = await api.models.User.findOne({ where: { email: params.email } })
    if (!user) { throw new Error('user not found') }
    await user.sendPasswordResetEmail()
  }
}

exports.userResetPassword = class userResetPassword extends Action {
  constructor () {
    super()
    this.name = 'user:resetPassword'
    this.description = 'to update the password for a uesr'
    this.outputExample = {}
    this.middleware = []
  }

  inputs () {
    return {
      passwordResetToken: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      email: {
        required: true,
        validator: s => { return validator.isEmail(s) }
      },
      password: {
        required: true,
        validator: s => { return validator.isLength(s, { min: api.models.User.minPasswordLength }) }
      }
    }
  }

  async run ({ response, params }) {
    const user = await api.models.User.findOne({ where: { email: params.email, passwordResetToken: params.passwordResetToken } })
    if (!user) { throw new Error('user not found or did not request a new password') }
    await user.updatePassword(params.password)
    response.user = user.apiData()
  }
}
