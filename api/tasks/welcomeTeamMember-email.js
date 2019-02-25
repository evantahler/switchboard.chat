const { Task, api } = require('actionhero')

module.exports = class WelcomeTeamMemberViaEmail extends Task {
  constructor () {
    super()
    this.name = 'welcomeTeamMember-email'
    this.description = 'send a welcome email to a new team member'
    this.frequency = 0
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const user = await api.models.User.findOne({ where: { id: params.userId } })
    const team = await api.models.Team.findOne({ where: { id: params.teamId } })

    if (!user.email) { return }

    const subject = `Your have been invited to ${team.name} on Switchboard`
    let emailData = {
      paragraphs: [
        `Hello!`,
        `Your have been invited to ${team.name} on Switchboard.  Switchboard is a tool you can use to share and send SMS messages with your clients and customers.`
      ],
      cta: 'Sign In',
      ctaLink: process.env.ALLOWED_ORIGIN + '/session/sign-in',
      signoff: 'Thanks, the Switchboard team.',
      greeting: 'Hi, ' + user.firstName
    }

    if (user.passwordResetToken) {
      emailData.cta = 'Sign Up'
      emailData.ctaLink = process.env.ALLOWED_ORIGIN + `/session/reset-password?passwordResetToken=${user.passwordResetToken}&userId=${user.id}&email=${user.email}`
    }

    await api.email.send(user.email, subject, emailData)
  }
}
