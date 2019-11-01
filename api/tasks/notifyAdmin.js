const { Task, api } = require('actionhero')

const email = 'admin@switchboard.chat'
const subject = 'OH NO!'

module.exports = class notifyAdmin extends Task {
  constructor () {
    super()
    this.name = 'notifyAdmin'
    this.description = 'send an email to switchboard admin if something goes wrong'
    this.frequency = 0
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const emailData = {
      paragraphs: [
        `Something has gone wrong:`,
        '----------------------------------'
      ].join(params.messages),
      signoff: 'Thanks, the Switchboard team.',
      greeting: 'Hello...'
    }

    await api.email.send(email, subject, emailData)
  }
}
