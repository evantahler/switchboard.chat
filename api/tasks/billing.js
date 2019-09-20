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

  async billTeam (team) {
    await team.charge()
  }

  async run (params) {
    const teams = await api.models.Team.findAll()
    for (const i in teams) {
      await this.billTeam(teams[i])
    }
  }
}
