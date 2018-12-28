const { Action, api } = require('actionhero')
const validator = require('validator')
const { parsePhoneNumber } = require('libphonenumber-js')

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

exports.twilioIn = class listNumbers extends Action {
  constructor () {
    super()
    this.name = 'twilio:in'
    this.description = 'to process incomming SMS messages'
    this.outputExample = {}
    this.middleware = []
  }

  inputs () {}

  async run ({ response, params, session }) { }
}

exports.twilioVoice = class listNumbers extends Action {
  constructor () {
    super()
    this.name = 'twilio:voice'
    this.description = 'to responsd to audio calls on SMS numbers'
    this.outputExample = {}
    this.middleware = []
  }

  inputs () {
    return {
      To: { required: true }
    }
  }

  async run (data) {
    const { params, connection } = data
    let response = 'We are sorry, that number is not recognized.  Goodbye.'

    const incommingNumber = parsePhoneNumber((params.To), api.config.twilio.phoneNumberDefaultCountry).formatInternational()

    const team = await api.models.Team.findOne({ where: { phoneNumber: incommingNumber } })
    if (team) { response = team.voiceResponse }
    const xml = api.twilio.renderVoiceResponse(response)
    connection.setHeader('Content-Type', 'application/xml')
    connection.rawConnection.res.end(xml)
    data.toRender = false
  }
}
