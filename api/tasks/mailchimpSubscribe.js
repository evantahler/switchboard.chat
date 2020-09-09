'use strict'
const { api, Task } = require('actionhero')

module.exports = class MyTask extends Task {
  constructor () {
    super()
    this.name = 'mailchimpSubscribe'
    this.description = 'an subscribe a new user to the mailchimp list'
    this.frequency = 0
    this.queue = 'default'
  }

  async run (data) {
    const user = await api.models.User.findOne({ where: { id: data.userId } })
    if (!user) { throw new Error('user not found for id: ' + data.userId) }

    await api.mailchimp.subscribe(user)
  }
}
