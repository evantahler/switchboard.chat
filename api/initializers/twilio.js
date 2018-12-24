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

      registerTeamPhoneNumber: async (team, phoneNumber) => {
        const client = api.twilio.client
        team.phoneNumber = api.twilio.sanitize(phoneNumber)
        const purchasedNumber = await client.incomingPhoneNumbers.create({ phoneNumber })
        team.sid = purchasedNumber.sid
        await team.save()
        await api.twilio.updateIncommingUrl(team)
      },

      realeaseTeamPhoneNumber: async (team) => {
        const client = api.twilio.client
        return client.incomingPhoneNumbers(team.sid).release()
      },

      updateIncommingUrl: async (team) => {
        const client = api.twilio.client
        const smsUrl = api.config.twilio.messageUrl
        return client.incomingPhoneNumbers(team.sid).update({ smsUrl })
      },

      sendMessage: async (team, person, body) => {
        const from = api.twilio.sanitize(team.phoneNumber)
        const to = api.twilio.sanitize(person.phoneNumber)
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
      }
    }
  }

  async start () {

  }
}
