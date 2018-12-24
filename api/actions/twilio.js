const { Action, api } = require('actionhero')
const validator = require('validator')

exports.listNumbers = class listNumbers extends Action {
  constructor () {
    super()
    this.name = 'twilio:listNumbers'
    this.description = 'to list available phone numbers for an area code'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  inputs () {
    return {
      areaCode: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 3, max: 3 }) }
      }
    }
  }

  async run ({ response, params, session }) {
    response.phoneNumbers = await api.twilio.listPhoneNumbers(params.areaCode)
  }
}
