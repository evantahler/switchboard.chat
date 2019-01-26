'use strict'
const { Task, api } = require('actionhero')

module.exports = class MyTask extends Task {
  constructor () {
    super()
    this.name = 'ensureTeamChatRooms'
    this.description = 'periodically ensure that the team chat rooms exist'
    this.frequency = 1000 * 60 * 60
    this.queue = 'default'
    this.middleware = []
  }

  async run (data) {
    const teams = await api.models.Team.findAll()
    for (let i in teams) {
      let team = teams[i]
      let channel = `team:${team.id}`
      try {
        await api.chatRoom.add(channel)
      } catch (error) {
        api.log(error)
      }
    }

    return { success: true }
  }
}
