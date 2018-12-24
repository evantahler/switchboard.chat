const { Action, api } = require('actionhero')
const validator = require('validator')
const { parsePhoneNumber } = require('libphonenumber-js')
const minPasswordLength = 6

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
        required: true,
        validator: s => { return validator.isLength(s, { min: minPasswordLength }) }
      },
      phoneNumber: {
        required: false,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ connection, response, params }) {
    const user = new api.models.User(params)
    await user.save()
    await user.updatePassword(params.password)
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
        validator: s => { return validator.isLength(s, { min: minPasswordLength }) }
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
    response.user = user.apiData()
  }
}
