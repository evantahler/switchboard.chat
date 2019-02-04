const { api, Action } = require('actionhero')
const validator = require('validator')
const { Op } = require('sequelize')

exports.messageSend = class taskCreate extends Action {
  constructor () {
    super()
    this.name = 'task:create'
    this.description = 'to create a task for a contact'
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
      title: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      description: {
        required: true,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      assignedUserId: {
        required: false,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, params, team, session }) {
    const contact = await api.models.Contact.findOne({ where: { id: params.contactId, teamId: team.id } })
    if (!contact) { throw new Error('contact not a member of this team') }
    const user = await api.models.User.findOne({ where: { id: session.userId } })
    if (!user) { throw new Error('user not found') }

    let assignedUser
    if (params.assignedUserId) {
      assignedUser = await api.models.User.findOne({ where: { id: params.assignedUserId } })
      if (!assignedUser) { throw new Error('assignedUser not found') }
    }

    const note = await team.addNote(contact, user, `Created Task: ${params.title}`)
    response.note = note.apiData()
    const task = await team.addTask(contact, note, user, params.title, params.description, assignedUser)
    response.task = await task.apiData()
  }
}

exports.taskEdit = class taskEdit extends Action {
  constructor () {
    super()
    this.name = 'task:edit'
    this.description = 'to edit a task'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      taskId: {
        required: false,
        formatter: s => { return parseInt(s) }
      },
      title: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      description: {
        required: false,
        validator: s => { return validator.isLength(s, { min: 1 }) }
      },
      assignedUserId: {
        required: false,
        formatter: s => { return parseInt(s) }
      },
      completedAt: {
        required: false,
        formatter: s => { return new Date(Date.parse(s)) }
      }
    }
  }

  async run ({ response, team, params, session }) {
    let assignedUser
    if (params.assignedUserId) {
      assignedUser = await api.models.User.findOne({ where: { id: params.assignedUserId } })
      if (!assignedUser) { throw new Error('assignedUser not found') }
    }

    const task = await team.updateTask(Object.assign({ assignedUser }, params))
    response.task = await task.apiData()

    if (params.completedAt) {
      const user = await api.models.User.findOne({ where: { id: session.userId } })
      if (!user) { throw new Error('user not found') }
      const contact = await api.models.Contact.findOne({ where: { id: task.contactId, teamId: team.id } })
      if (!contact) { throw new Error('contact not found') }
      const note = await team.addNote(contact, user, `Completed Task: ${task.title}`)
      response.note = note.apiData()
    }
  }
}

exports.tasksList = class tasksList extends Action {
  constructor () {
    super()
    this.name = 'tasks:list'
    this.description = 'to list tasks'
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
      assignedUserId: {
        required: false,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, team, params }) {
    let tasks
    if (params.contactId) {
      tasks = await api.models.Task.findAll({
        where: { teamId: team.id, contactId: params.contactId, completedAt: { [Op.eq]: null } }
      })
    } else if (params.assignedUserId) {
      tasks = await api.models.Task.findAll({
        where: { teamId: team.id, assignedUserId: params.assignedUserId, completedAt: { [Op.eq]: null } }
      })
    } else {
      throw new Error('either assignedUserId or contactId is required')
    }

    response.tasks = []
    for (let i in tasks) {
      response.tasks.push(await tasks[i].apiData())
    }
  }
}

exports.taskDelete = class taskEdit extends Action {
  constructor () {
    super()
    this.name = 'task:delete'
    this.description = 'to delete a task'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      taskId: {
        required: false,
        formatter: s => { return parseInt(s) }
      }
    }
  }

  async run ({ response, team, params }) {
    await team.removeTask(params)
  }
}
