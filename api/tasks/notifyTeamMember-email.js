const { Task, api } = require('actionhero')

module.exports = class notifyTeamMemberViaEmail extends Task {
  constructor () {
    super()
    this.name = 'notifyTeamMember-email'
    this.description = 'send an email to a team member about unread messages'
    this.frequency = 0
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const user = await api.models.User.findOne({ where: { id: params.userId } })
    const team = await api.models.Team.findOne({ where: { id: params.teamId } })

    if (!user.email) { return }

    const subject = `${team.name} has unread messages`
    const unredMessages = await api.models.Message.findAll({
      where: { teamId: team.id, read: false, direction: 'in' },
      order: [['createdAt', 'desc']]
    })

    const emailData = {
      paragraphs: [
        `${team.name} has unread messages.`,
        'Visit www.switchboard.chat to read them.',
        '----------------------------------'
      ],
      cta: 'Sign In',
      ctaLink: process.env.ALLOWED_ORIGIN + '/session/sign-in',
      signoff: 'Thanks, the Switchboard team.',
      greeting: 'Hi, ' + user.firstName
    }

    unredMessages.forEach((message) => {
      const stanza = `[${message.from}] ${message.message}`
      emailData.paragraphs.push(stanza)
    })

    await api.email.send(user.email, subject, emailData)
  }
}
