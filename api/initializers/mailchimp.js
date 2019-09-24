const { api, Initializer } = require('actionhero')
const Mailchimp = require('mailchimp-api-v3')

module.exports = class MailchimpInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'mailchimp'
  }

  async initialize () {
    let client = {}
    try {
      client = new Mailchimp(api.config.mailchimp.apiKey)
    } catch (e) {
      api.log(`Mailchimp Error: ${e}`, 'warning')
    }

    api.mailchimp = {
      client,
      subscribe: async (user) => {
        const path = `/lists/${api.config.mailchimp.listId}/members`
        api.log(`adding ${user.email} to mailchimp via path: ${path}`)
        try {
          await api.mailchimp.client.post(path, {
            email_address: user.email,
            merge_fields: {
              FIRST_NAME: user.firstName,
              LAST_NAME: user.lastName
              // PHONE: user.phoneNumber
            },
            status: 'subscribed'
          })
        } catch (error) {
          if (error.errors) {
            error.errors.forEach((e) => api.log(e, 'error'))
          }
          throw (error)
        }
      }
    }
  }
}
