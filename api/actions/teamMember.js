const { Action } = require('actionhero')
const validator = require('validator')

exports.teamMemberCreate = class teamMemberCreate extends Action {
  constructor () {
    super()
    this.name = 'teamMember:create'
    this.description = 'to create a team member'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      userId: {
        required: false,
        formatter: s => { return parseInt(s) }
      },
      email: {
        required: false,
        validator: s => { return validator.isEmail(s) }
      },
      firstName: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      lastName: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      }
    }
  }

  async run ({ response, params, team }) {
    if (!params.userId && !params.email) { throw new Error('either userId or email is required') }
    const teamMember = await team.addTeamMember(params)
    // TODO send invitation email
    response.teamMember = teamMember.apiData()
  }
}

exports.teamMemberList = class teamMemberList extends Action {
  constructor () {
    super()
    this.name = 'teamMember:list'
    this.description = 'to list the members of a team'
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
    const teamMembers = await team.teamMembers()
    response.teamMembers = teamMembers.map(tm => { return tm.apiData() })
  }
}

exports.teamMemberRemove = class teamMemberRemove extends Action {
  constructor () {
    super()
    this.name = 'teamMember:remove'
    this.description = 'to remove a team member'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      userId: {
        required: true,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, params, team }) {
    await team.removeTeamMember(params.userId)
    response.success = true
  }
}
