const { Task, api } = require('actionhero')

module.exports = class EnsureTeamRooms extends Task {
  constructor () {
    super()
    this.name = 'ensureTeamRooms'
    this.description = 'ensure that all team rooms are created, even after wiping redis'
    this.frequency = 1000 * 60 * 60
    this.queue = 'default'
    this.middleware = []
  }

  async run (data) {
    const teams = await api.models.Team.findAll()
    for (let i in teams) {
      let team = teams[i]
      try {
        await team.ensureRoom()
      } catch (error) {
        if (!error.toString().match(/room exists/)) { throw error }
      }
    }

    return `checked ${teams.length} teams`
  }
}
