const { api, Initializer } = require('actionhero')
const Stripe = require('stripe')

module.exports = class TwilioInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'stripe'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    api.stripe = {
      client: Stripe(api.config.stripe.SecretKey),

      createCustomer: async (team, stripeToken) => {
        const client = api.stripe.client
        return client.customers.create({
          source: stripeToken,
          description: `Switchboard Team #${team.id}`,
          email: team.billingEmail
        })
      },

      updateDefaultPaymentMethod: async (team, stripeToken) => {
        const client = api.stripe.client
        return client.customers.update(team.stripeCustomerId, { source: stripeToken })
      },

      destroyCustomer: async (stripeCustomerId) => {
        const client = api.stripe.client
        return client.customers.del(stripeCustomerId)
      },

      cardDetails: async (team) => {
        const client = api.stripe.client
        const response = await client.customers.update(team.stripeCustomerId, {})
        const defaultSourceId = response.default_source

        if (!response.sources && !response.sources.data) { return null }

        let match
        response.sources.data.map((source) => {
          if (source.id === defaultSourceId) { match = source }
        })

        return match
      }
    }
  }
}
