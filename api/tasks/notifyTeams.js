const { Task, api } = require('actionhero')

module.exports = class NotifyTeams extends Task {
  constructor () {
    super()
    this.name = 'notifyTeams'
    this.description = 'check all teams that might be need to notifued'
    this.frequency = 1000 * 60
    this.queue = 'notifications'
    this.middleware = []
  }

  async run () {
    const teams = await api.models.Team.findAll()
    for (let i in teams) {
      let team = teams[i]
      await api.tasks.enqueue('notifyTeam', { teamId: team.id }, 'notifications')
    }
  }
}
