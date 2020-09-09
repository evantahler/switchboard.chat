const { Task, api } = require('actionhero')

module.exports = class notifyTeamMemberViaSMS extends Task {
  constructor () {
    super()
    this.name = 'notifyTeamMember-sms'
    this.description = 'send an SMS to a team member about unread messages'
    this.frequency = 0
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const user = await api.models.User.findOne({ where: { id: params.userId } })
    const team = await api.models.Team.findOne({ where: { id: params.teamId } })
    const message = `You have ${params.unreadMessagesCount} unread messages for your Switchboard team, ${team.name}`

    if (!user.phoneNumber) { return }

    let contact = await api.models.Contact.findOne({ where: { phoneNumber: user.phoneNumber } })

    if (!contact) {
      const folder = await api.models.Folder.findOne({ where: { teamId: team.id, deletable: false } })
      contact = await team.addContact({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        folderId: folder.id
      })
    }

    await team.addMessage(contact, message)
  }
}
