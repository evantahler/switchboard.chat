const { api, Initializer } = require('actionhero')
const Twilio = require('twilio')
const { parsePhoneNumber } = require('libphonenumber-js')

module.exports = class TwilioInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'twilio'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    if (!api.config.twilio.ssid || !api.config.twilio.ssid || api.env === 'test') {
      // instanstiating the Twilio client requires a valid API key...
      api.log('Mocking Twilio...', 'warning')
      return
    }

    api.twilio = {
      client: Twilio(api.config.twilio.ssid, api.config.twilio.token),

      format: (number) => {
        const countryCode = api.config.twilio.phoneNumberDefaultCountry
        return parsePhoneNumber(number, countryCode).formatInternational()
      },

      listPhoneNumbers: async (areaCode) => {
        const client = api.twilio.client
        const countryCode = api.config.twilio.phoneNumberDefaultCountry
        return client.availablePhoneNumbers(countryCode).local.list({ areaCode, smsEnabled: true })
      },

      registerTeamPhoneNumber: async (team) => {
        const client = api.twilio.client
        const purchasedNumber = await client.incomingPhoneNumbers.create({
          phoneNumber: team.phoneNumber,
          friendlyName: `${api.env} - Team #${team.id}`
        })
        team.sid = purchasedNumber.sid
        try {
          await api.twilio.updateIncommingUrl(team)
        } catch (error) {
          await api.twilio.realeaseTeamPhoneNumber(team)
          throw error
        }
      },

      realeaseTeamPhoneNumber: async (team) => {
        const client = api.twilio.client
        return client.incomingPhoneNumbers(team.phoneNumber).release()
      },

      updateIncommingUrl: async (team) => {
        const client = api.twilio.client
        const smsUrl = api.config.twilio.messageUrl
        const voiceUrl = api.config.twilio.voiceUrl
        return client.incomingPhoneNumbers(team.sid).update({ smsUrl, voiceUrl })
      },

      sendMessage: async (team, person, body) => {
        const from = team.phoneNumber
        const to = person.phoneNumber
        const message = api.models.message.build({
          from: from,
          to: to,
          message: body,
          direction: 'out',
          read: true,
          teamId: team.id
        })

        await message.save()

        try {
          await api.twilio.client.sendMessage({ to, from, body: message.message })
        } catch (error) {
          await message.destroy()
          throw error
        }

        return api.chatRoom.broadcast({}, 'team:' + team.id, message.apiData())
      },

      renderVoiceResponse: (message) => {
        const VoiceResponse = Twilio.twiml.VoiceResponse
        const response = new VoiceResponse()
        response.say(message)
        const xml = response.toString()
        return xml
      }
    }
  }

  async start () {

  }
}
