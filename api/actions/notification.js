const { Action, api } = require('actionhero')

exports.notificationsList = class notificationsList extends Action {
  constructor () {
    super()
    this.name = 'notifications:list'
    this.description = 'to list notifications'
    this.outputExample = {}
    this.middleware = ['logged-in-session']
  }

  async run ({ connection, response, session }) {
    response.notifications = []
    const notifications = await api.models.Notification.findAll({ where: { userId: session.userId } })
    for (let i in notifications) {
      let notification = await notifications[i].apiData()
      response.notifications.push(notification)
    }
  }
}

exports.notificationEdit = class notificationEdit extends Action {
  constructor () {
    super()
    this.name = 'notification:edit'
    this.description = 'to edit a notification'
    this.outputExample = {}
    this.middleware = ['logged-in-session', 'team-membership']
  }

  inputs () {
    return {
      teamId: {
        required: true,
        formatter: s => { return parseInt(s) }
      },
      enabled: {
        required: false,
        formatter: s => { return s === 'true' }
      },
      medium: {
        required: false,
        validator: (s) => {
          if (api.models.Notification.allowedMediums().indexOf(s) < 0) {
            return false
          } else {
            return true
          }
        }
      },
      delayMiliseconds: {
        required: false,
        formatter: s => { return parseInt(s) },
        validator: (s) => {
          if (s < 1) {
            return false
          } else {
            return true
          }
        }
      }
    }
  }

  async run ({ connection, params, response, session }) {
    const notification = await api.models.Notification.findOne({ where: { teamId: params.teamId, userId: session.userId } })
    if (!notification) { throw new Error('notification not found for this team') }

    if (params.enabled === true || params.enabled === false) { notification.enabled = params.enabled }
    if (params.medium) { notification.medium = params.medium }
    if (params.delayMiliseconds) { notification.delayMiliseconds = params.delayMiliseconds }

    await notification.save()
    response.notification = await notification.apiData()
  }
}
