const { Action, api } = require('actionhero')
const { Op } = require('sequelize')
const { parsePhoneNumber } = require('libphonenumber-js')
const TeamRegisterOp = require('./../vendorOperations/teamRegister')
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
      },
      voiceResponse: {
        required: false
      }
    }
  }

  async run ({ response, params, session }) {
    const team = new api.models.Team(params)
    await team.save()

    const user = await api.models.User.findOne({ where: { id: session.userId } })
    const teamMember = await team.addTeamMember({
      email: user.email,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    })

    await new TeamRegisterOp(team, teamMember, params.stripeToken).run()
    const folder = new api.models.Folder({ teamId: team.id, name: 'default folder', deletable: false })
    await folder.save()

    response.team = team.apiData()
    response.teamMember = teamMember.apiData()
    response.folder = folder.apiData()
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

exports.teamViewBilling = class teamView extends Action {
  constructor () {
    super()
    this.name = 'team:view:billing'
    this.description = 'to view the saved card for a team '
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
    const charges = await api.models.Charge.findAll({ where: { teamId: team.id } })
    response.charges = []
    for (let i in charges) {
      let apiData = await charges[i].apiData()
      response.charges.push(apiData)
    }

    response.card = await api.stripe.cardDetails(team)
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
      }
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
      },
      billingEmail: {
        required: false,
        validator: s => { return validator.isEmail(s) }
      },
      voiceResponse: {
        required: false
      },
      stripeToken: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      }
    }
  }

  async run ({ response, params, team }) {
    team = Object.assign(team, params)
    await team.save()

    if (params.stripeToken) {
      await new TeamRegisterOp(team, null, params.stripeToken).registierWithStripe()
    }

    response.team = team.apiData()
  }
}

exports.associateWebsocketToTeam = class associateWebsocketToTeam extends Action {
  constructor () {
    super()
    this.name = 'teams:associateWebsocket'
    this.description = 'to link a ws connection to an HTTP session for access to a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      websocketConnectionFingerprint: {
        required: true
      }
    }
  }

  async run ({ team, params, response }) {
    if (!team) { throw new Error('team not found') }
    response.success = await api.connections.apply(params.websocketConnectionFingerprint, 'set', ['teamId', params.teamId])
  }
}
