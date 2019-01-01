const { api, Action } = require('actionhero')
const validator = require('validator')

exports.messageSend = class messageSend extends Action {
  constructor () {
    super()
    this.name = 'message:send'
    this.description = 'to create an outgoing message for a contact'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      contactId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      message: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      }
    }
  }

  async run ({ response, params, team }) {
    const contact = await api.models.Contact.findOne({ where: { id: params.contactId, teamId: team.id } })
    if (!contact) { throw new Error('contact not a member of this team') }
    const message = await team.addMessage(contact, params.message)
    response.message = message.apiData()
  }
}

exports.messagesAndNotesList = class messagesAndNotesList extends Action {
  constructor () {
    super()
    this.name = 'messages:list'
    this.description = 'to list messages and notes for a contact'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      contactId: {
        required: true,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, params, team }) {
    const contact = await api.models.Contact.findOne({ where: { id: params.contactId, teamId: team.id } })
    if (!contact) { throw new Error('contact not a member of this team') }
    const messages = await team.messagesAndNotes(contact)

    response.messages = []
    for (let i in messages) {
      response.messages.push(await messages[i].apiData())
    }
  }
}
