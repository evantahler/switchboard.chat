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
      },
      file: {
        required: false
      },
      type: {
        required: true,
        default: 'message'
      }
    }
  }

  async run ({ response, params, team, session }) {
    const contact = await api.models.Contact.findOne({ where: { id: params.contactId, teamId: team.id } })
    if (!contact) { throw new Error('contact not a member of this team') }
    const user = await api.models.User.findOne({ where: { id: session.userId } })
    if (!user) { throw new Error('user not found') }

    let attachment
    if (params.file && params.file.path) {
      attachment = await team.uploadFile(params.file.path, params.file.name, contact)
    }

    if (params.type === 'message') {
      const message = await team.addMessage(contact, params.message, attachment)
      response.message = message.apiData()
    } else if (params.type === 'note') {
      const note = await team.addNote(contact, user, params.message)
      response.note = note.apiData()
    } else {
      throw new Error(`message type ${params.type} not known`)
    }
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
        required: false,
        formatter: s => { return parseInt(s) }
      },
      folderId: {
        required: false,
        formatter: s => { return parseInt(s) }
      },
      limit: {
        required: false,
        formatter: s => { return parseInt(s) },
        default: 3
      },
      offset: {
        required: false,
        formatter: s => { return parseInt(s) },
        default: 0
      }
    }
  }

  async run ({ response, params, team }) {
    const messages = await team.messagesAndNotes(params)

    response.messages = []
    for (const i in messages) {
      response.messages.push(await messages[i].apiData())
    }

    response.messagesCount = await team.messagesCount(params)
  }
}
