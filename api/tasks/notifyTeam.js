const { Task, api } = require('actionhero')

module.exports = class NotifyTeam extends Task {
  constructor () {
    super()
    this.name = 'notifyTeam'
    this.description = 'notify all team members about new messages'
    this.frequency = 0
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const team = await api.models.Team.findOne({ where: { id: params.teamId } })
    const unreadMessages = await api.models.Message.findAll({
      where: {
        teamId: team.id,
        direction: 'in',
        read: false
      },
      order: [['createdAt', 'desc']]
    })

    if (unreadMessages.length === 0) { return }

    const oldestUnreadMessage = unreadMessages[(unreadMessages.length - 1)]
    const oldestUnreadMessageSentMsAgo = (new Date()).getTime() - oldestUnreadMessage.createdAt.getTime()

    const notifications = await api.models.Notification.findAll({ where: { teamId: team.id } })
    const notifiedUserIds = []
    for (const i in notifications) {
      const notification = notifications[i]

      // console.log({
      //   enabled: notification.enabled,
      //   oldestUnreadMessageSentMsAgo,
      //   delayMiliseconds: notification.delayMiliseconds,
      //   oldestUnreadMessageGetTime: oldestUnreadMessage.createdAt.getTime(),
      //   notificationNotifiedAtGetTime: notification.notifiedAt ? notification.notifiedAt.getTime() : 'nope'
      // })

      if (
        notification.enabled &&
        oldestUnreadMessageSentMsAgo > notification.delayMiliseconds &&
        (!notification.notifiedAt || oldestUnreadMessage.createdAt.getTime() > notification.notifiedAt.getTime())
      ) {
        api.log(`notifying user #${notification.userId} about ${unreadMessages.length} unread messages for team #${team.id}`)

        await api.tasks.enqueue(`notifyTeamMember-${notification.medium}`, {
          teamId: team.id,
          userId: notification.userId,
          oldestUnreadMessageSentMsAgo,
          unreadMessagesCount: unreadMessages.length
        }, 'notifications')

        notifiedUserIds.push(notification.userId)
        notification.notifiedAt = new Date()
        await notification.save()
      }
    }
  }
}
