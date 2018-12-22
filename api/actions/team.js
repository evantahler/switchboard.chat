const { Action, api } = require('actionhero')
const { Op } = require('sequelize')
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
      }
    }
  }

  async run ({ response, params, session }) {
    const team = new api.models.Team(params)
    await team.save()
    const teamMember = new api.models.TeamMember({ userId: session.userId, teamId: team.id })
    await teamMember.save()
    response.team = team.apiData()
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
    response.teams = teams.map(t => { return t.apiData() })
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
