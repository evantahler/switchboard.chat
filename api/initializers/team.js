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
        const team = await api.models.Team.findOne({ where: { id: params.teamId, enabled: true } })
        if (!team) { throw new Error('team not found') }
        data.team = team
      }
    }

    const teamChatMiddlewareAuth = {
      name: 'team-chat-middleware-auth',
      priority: 1000,
      join: async (connection, room) => {
        const teamId = parseInt(room.split(':')[1])
        const sessionData = await api.session.load(connection)
        if (!sessionData || !sessionData.userId) { return connection.end() }
        const teamMember = await api.models.TeamMember.findOne({ where: { userId: sessionData.userId, teamId } })
        if (!teamMember) { return connection.end() }
      }
    }

    api.actions.addMiddleware(ensureTeamMiddleware)
    api.chatRoom.addMiddleware(teamChatMiddlewareAuth)
  }
}
