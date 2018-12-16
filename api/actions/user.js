const { Action, api } = require('actionhero')
const validator = require('validator')
const { parsePhoneNumber } = require('libphonenumber-js')
const minPasswordLength = 6
const phoneNumberDefaultCountry = 'US'

exports.userCreate = class userCreate extends Action {
  constructor () {
    super()
    this.name = 'userCreate'
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
        formatter: s => { return parsePhoneNumber(s, phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ connection, response, params }) {
    const user = new api.models.User(params)
    await user.save()
    await user.updatePassword(params.password)
    response.user = user.apiData()
  }
}

exports.userView = class userView extends Action {
  constructor () {
    super()
    this.name = 'userView'
    this.description = 'to view a user'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  inputs () {
    return {
      userId: {
        required: true,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ connection, response, params, session }) {
    if (params.userId !== session.userId) { throw new Error('you cannot view this user') }
    const user = await api.models.User.findOne({ where: { id: params.userId } })
    response.user = user.apiData()
  }
}
