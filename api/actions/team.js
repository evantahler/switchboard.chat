const { Action, api } = require('actionhero')
const { Op } = require('sequelize')
const { parsePhoneNumber } = require('libphonenumber-js')
const validator = require('validator')

exports.teamCreate = class teamCreate extends Action {
  constructor () {
    super()
    this.name = 'team:create'
    this.description = 'to create a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  inputs () {
    return {
      name: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      stripeToken: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      phoneNumber: {
        required: true,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      },
      billingEmail: {
        required: false,
        validator: s => { return validator.isEmail(s) }
      }
    }
  }

  async run ({ response, params, session }) {
    const team = new api.models.Team(params)
    await team.save()
    const teamMember = new api.models.TeamMember({ userId: session.userId, teamId: team.id })
    await teamMember.save()

    let stripeCustomer
    try {
      stripeCustomer = await api.stripe.createCustomer(team, params.stripeToken)
      team.stripeCustomerId = stripeCustomer.id
      await team.save()
      await api.twilio.registerTeamPhoneNumber(team)
      response.team = team.apiData()
      response.teamMember = teamMember.apiData()
    } catch (error) {
      await team.destroy()
      await teamMember.destroy()
      if (stripeCustomer) { await api.stripe.destroyCustomer(stripeCustomer.id) }
      throw error
    }
  }
}

exports.teamView = class teamView extends Action {
  constructor () {
    super()
    this.name = 'team:view'
    this.description = 'to view a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, team }) {
    response.team = team.apiData()
    response.stats = await team.stats()
  }
}

exports.teamsList = class teamsList extends Action {
  constructor () {
    super()
    this.name = 'teams:list'
    this.description = 'to list all my teams'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  inputs () {
    return {}
  }

  async run ({ response, session }) {
    const teamMemberships = await api.models.TeamMember.findAll({ where: { userId: session.userId } })
    const teams = await api.models.Team.findAll({ where: {
      id: {
        [Op.in]: teamMemberships.map(t => { return t.teamId })
      },
      enabled: true
    } })

    response.teams = []
    for (let i in teams) {
      let team = teams[i]
      let apiData = team.apiData()
      apiData.stats = await team.stats()
      response.teams.push(apiData)
    }
  }
}

exports.teamEdit = class teamEdit extends Action {
  constructor () {
    super()
    this.name = 'team:edit'
    this.description = 'to edit a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      name: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      }
    }
  }

  async run ({ response, params, team }) {
    team = Object.assign(team, params)
    await team.save()
    response.team = team.apiData()
  }
}
