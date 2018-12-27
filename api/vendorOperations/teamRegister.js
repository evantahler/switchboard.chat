const { api } = require('actionhero')

class TeamRegisterOp {
  constructor (team, teamMember, stripeToken) {
    this.team = team
    this.stripeToken = stripeToken
    this.teamMember = teamMember
    this.stripeCustomer = null
  }

  async registierWithStripe () {
    this.stripeCustomer = await api.stripe.createCustomer(this.team, this.stripeToken)
    this.team.stripeCustomerId = this.stripeCustomer.id
    return this.team.save()
  }

  async registerWithTwilio () {
    return api.twilio.registerTeamPhoneNumber(this.team)
  }

  async rollback (originalError) {
    try {
      await this.team.destroy()
      await this.teamMember.destroy()
      if (this.stripeCustomer) { await api.stripe.destroyCustomer(this.stripeCustomer.id) }
      throw originalError
    } catch (error) {
      throw originalError
    }
  }

  async run () {
    try {
      await this.registierWithStripe()
      await this.registerWithTwilio()
    } catch (error) {
      await this.rollback(error)
    }
  }
}

module.exports = TeamRegisterOp
