const { Action } = require('actionhero')
const validator = require('validator')

exports.folderCreate = class folderCreate extends Action {
  constructor () {
    super()
    this.name = 'folder:create'
    this.description = 'to create a folder for a team'
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
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      }
    }
  }

  async run ({ response, params, team }) {
    const folder = await team.addFolder(params.name)
    response.folder = folder.apiData()
  }
}

exports.folderEdit = class folderEdit extends Action {
  constructor () {
    super()
    this.name = 'folder:edit'
    this.description = 'to edit a folder for a team'
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
      name: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      }
    }
  }

  async run ({ response, params, team }) {
    const folder = await team.updateFolder(params)
    response.folder = folder.apiData()
  }
}

exports.foldersList = class foldersList extends Action {
  constructor () {
    super()
    this.name = 'folders:list'
    this.description = 'to list folders for a team'
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

  async run ({ response, params, team }) {
    const folders = await team.folders()
    response.folders = folders.map(c => { return c.apiData() })
  }
}

exports.folderDestroy = class folderDestroy extends Action {
  constructor () {
    super()
    this.name = 'folder:destroy'
    this.description = 'to remove a folder for a team'
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
      }
    }
  }

  async run ({ response, params, team }) {
    await team.removeFolder(params.folderId)
    response.success = true
  }
}
