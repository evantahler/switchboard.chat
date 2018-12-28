const { Action, api } = require('actionhero')
const validator = require('validator')
const { parsePhoneNumber } = require('libphonenumber-js')

exports.contactCreate = class contactCreate extends Action {
  constructor () {
    super()
    this.name = 'contact:create'
    this.description = 'to create a contact for a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      folderId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      firstName: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      lastName: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      phoneNumber: {
        required: true,
        formatter: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).formatInternational() },
        validator: s => { return parsePhoneNumber(s, api.config.twilio.phoneNumberDefaultCountry).isValid() }
      }
    }
  }

  async run ({ response, params, team }) {
    const contact = await team.addContact(params)
    response.contact = await contact.apiData()
  }
}

exports.contactsList = class contactsList extends Action {
  constructor () {
    super()
    this.name = 'contacts:list'
    this.description = 'to list contacts for a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      folderId: {
        required: false,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, params, team }) {
    const contacts = await team.contacts(params.folderId)
    response.contacts = []
    for (let i in contacts) {
      response.contacts.push(await contacts[i].apiData())
    }
  }
}

exports.contactEdit = class contactEdit extends Action {
  constructor () {
    super()
    this.name = 'contact:edit'
    this.description = 'to edit for a team'
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
      folderId: {
        required: false,
        formatter: s => { return parseInt(s) }
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
    const contact = await team.updateContact(params)
    response.contact = await contact.apiData()
  }
}

exports.contactDestroy = class contactDestroy extends Action {
  constructor () {
    super()
    this.name = 'contact:destroy'
    this.description = 'to remove a contact for a team'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      folderId: {
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
    await team.removeContact(params)
    response.success = true
  }
}
