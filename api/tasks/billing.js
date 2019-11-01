const { Task, api } = require('actionhero')

module.exports = class Billing extends Task {
  constructor () {
    super()
    this.name = 'billing'
    this.description = 'check if we need to bill the team'
    this.frequency = (1000 * 60 * 60 * 6)
    this.queue = 'notifications'
    this.middleware = []
  }

  async run (params) {
    const teams = await api.models.Team.findAll()
    for (const i in teams) {
      try {
        await teams[i].charge()
      } catch (error) {
        const messages = []
        messages.push(`unable to bill team: ${JSON.stringify(teams[i])}`)
        messages.push('- - - - -')
        messages.push(`error: ${error.message}`)
        for (const i in error.stack.split('\n')) { messages.push(error.stack[i]) }

        api.log(`something went wrong with billing team ${teams[i].id}... notifying admin`)
        await api.tasks.enqueue('notifyAdmin', { messages }, 'notifications')
      }
    }
  }
}
