const { Task, api } = require('actionhero')

module.exports = class ResetPasswordViaEmail extends Task {
  constructor () {
    super()
    this.name = 'resetPassword-email'
    this.description = 'send a reset password email'
    this.frequency = 0
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const user = await api.models.User.findOne({ where: { id: params.userId } })
    if (!user.email) { return }

    const subject = 'Reset your password'
    const emailData = {
      paragraphs: [
        'Hello!',
        'Someone has requested to reset your password.  If you didn\'t request to reset your passowrd, pleaase contact customer support.'
      ],
      cta: 'Reset Password',
      ctaLink: process.env.ALLOWED_ORIGIN + `/session/reset-password?passwordResetToken=${user.passwordResetToken}&email=${user.email}`,
      signoff: 'Thanks, the Switchboard team.',
      greeting: 'Hi, ' + user.firstName
    }

    await api.email.send(user.email, subject, emailData)
  }
}
