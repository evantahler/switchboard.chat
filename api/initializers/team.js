const { api, Initializer } = require('actionhero')

module.exports = class TeamInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'team'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async start () {
    const ensureTeamMiddleware = {
      name: 'team-membership',
      global: false,
      priority: 1001,
      preProcessor: async (data) => {
        const { session, params } = data
        if (!params.teamId) { throw new Error('teamId is required') }
        const initiatingTeamMember = await api.models.TeamMember.findOne({ where: { userId: session.userId, teamId: params.teamId } })
        if (!initiatingTeamMember) { throw new Error('you are not a member of this team') }
        const team = await api.models.Team.findOne({ where: { id: params.teamId } })
        if (!team) { throw new Error('team not found') }
        data.team = team
      }
    }

    api.actions.addMiddleware(ensureTeamMiddleware)

    const teamRoomProtectionMiddleware = {
      name: 'team chat room protection middleware',
      join: async (connection, room) => {
        const teamId = parseInt(room.split('-')[1])
        if (teamId !== connection.teamId) { throw new Error('blocked from joining the room.  Did you authorize?') }
      }
    }

    api.chatRoom.addMiddleware(teamRoomProtectionMiddleware)
  }
}
