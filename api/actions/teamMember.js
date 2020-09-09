const { Action, api } = require('actionhero')
const validator = require('validator')
const { parsePhoneNumber } = require('libphonenumber-js')

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
      },
      phoneNumber: {
        required: false,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ response, params, team }) {
    if (!params.userId && !params.email) { throw new Error('either userId or email is required') }
    const teamMember = await team.addTeamMember(params)
    await api.tasks.enqueue('welcomeTeamMember-email', { teamId: team.id, userId: teamMember.userId }, 'notifications')
    await api.tasks.enqueue('mailchimpSubscribe', { userId: teamMember.userId }, 'default')
    response.teamMember = teamMember.apiData()
  }
}

exports.teamMemberList = class teamMemberList extends Action {
  constructor () {
    super()
    this.name = 'teamMembers:list'
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

exports.teamMemberEdit = class teamMemberEdit extends Action {
  constructor () {
    super()
    this.name = 'teamMember:edit'
    this.description = 'to edit a team member'
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
      },
      phoneNumber: {
        required: false,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ response, params, team, session }) {
    if (session.userId === params.userId) { throw new Error('you cannot edit yourself via this method') }
    const teamMember = await team.editTeamMember(params)
    response.teamMember = await teamMember.apiData()
  }
}

exports.teamMemberDestroy = class teamMemberDestroy extends Action {
  constructor () {
    super()
    this.name = 'teamMember:destroy'
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

  async run ({ response, params, team, session }) {
    if (session.userId === params.userId) { throw new Error('you cannot remove yourself from a team') }
    await team.removeTeamMember(params.userId)
    response.success = true
  }
}
