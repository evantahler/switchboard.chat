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

  inputs () {
    return {
      To: {
        required: true,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      },
      From: {
        required: true,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      },
      MediaUrl0: { required: false },
      Body: { required: false },
      AccountSid: { required: true }
    }
  }

  async run (data) {
    const { params, connection } = data
    if (params.AccountSid !== api.config.twilio.ssid) { throw new Error('Twilio account SID does not match') }
    const team = await api.models.Team.findOne({ where: { phoneNumber: params.To } })
    if (!team) { throw new Error('team not found') }
    let contact = await api.models.Contact.findOne({ where: { phoneNumber: params.From } })

    if (!contact) {
      const folder = await api.models.Folder.findOne({ where: { teamId: team.id, deletable: false } })
      contact = await team.addContact({
        firstName: 'unknown',
        lastName: 'person',
        phoneNumber: params.From,
        folderId: folder.id
      })
    }

    let attachment
    if (params.MediaUrl0) {
      const { originalFileName, localFile } = await api.twilio.downloadAttachment(params.MediaUrl0)
      attachment = await team.uploadFile(localFile, originalFileName, contact)
      api.log(`downloaded ${params.MediaUrl0} => uploaded to ${attachment}`)
    }

    const message = new api.models.Message({
      from: params.From,
      to: params.To,
      message: params.Body || (''),
      attachment: attachment,
      direction: 'in',
      teamId: team.id,
      read: false,
      contactId: contact.id
    })

    await message.save()
    await api.chatRoom.broadcast({}, `team-${team.id}`, { message: await message.apiData(), method: 'create' })
    connection.setHeader('Content-Type', 'application/xml')
    connection.rawConnection.res.end('<Response></Response>')
    data.toRender = false
  }
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
      To: {
        required: true,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      },
      AccountSid: { required: true }
    }
  }

  async run (data) {
    const { params, connection } = data
    let response = 'We are sorry, that number is not recognized.  Goodbye.'

    if (params.AccountSid !== api.config.twilio.ssid) { throw new Error('Twilio account SID does not match') }

    const team = await api.models.Team.findOne({ where: { phoneNumber: params.To } })
    if (team) { response = team.voiceResponse }
    const xml = api.twilio.renderVoiceResponse(response)
    connection.setHeader('Content-Type', 'application/xml')
    connection.rawConnection.res.end(xml)
    data.toRender = false
  }
}
