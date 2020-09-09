const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let user
let team
let connection
let csrfToken

describe('user', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })
  beforeAll(async () => {
    const userResponse = await api.specHelper.runAction('user:create', {
      firstName: 'Peach',
      lastName: 'Toadstool',
      email: 'peach@example.com',
      password: 'passw0rd'
    })
    user = userResponse.user

    connection = await api.specHelper.Connection.createAsync()
    connection.params = { email: 'peach@example.com', password: 'passw0rd' }

    const sessionResponse = await api.specHelper.runAction('session:create', connection)
    csrfToken = sessionResponse.csrfToken

    connection.params = {
      csrfToken,
      userId: user.id,
      name: 'Mushroom Kingdom',
      phoneNumber: '+1 412 867 5309',
      billingEmail: user.email,
      stripeToken: 'xxx'
    }
    const createResponse = await api.specHelper.runAction('team:create', connection)
    team = createResponse.team
  })

  afterAll(async () => { await actionhero.stop() })

  describe('teamMember:create', () => {
    test('can create a team member (new user from email)', async () => {
      connection.params = {
        csrfToken,
        teamId: team.id,
        email: 'mario@example.com',
        firstName: 'Mario',
        lastName: 'Mario'
      }
      const { error, teamMember } = await api.specHelper.runAction('teamMember:create', connection)

      expect(error).toBeUndefined()
      expect(teamMember.id).toBeTruthy()
      expect(teamMember.userId).toBeTruthy()
      expect(teamMember.teamId).toBeTruthy()
    })
  })

  describe('team:members:edit', () => {
    afterAll(async () => {
      const mario = await api.models.User.findOne({ where: { email: 'mario@example.com' } })
      mario.firstName = 'Mario'
      await mario.save()
    })

    test('can edit team members', async () => {
      const mario = await api.models.User.findOne({ where: { email: 'mario@example.com' } })
      connection.params = { csrfToken, teamId: team.id, userId: mario.id, firstName: 'Mario!!!' }
      const { error, teamMember } = await api.specHelper.runAction('teamMember:edit', connection)

      expect(error).toBeUndefined()
      expect(teamMember.firstName).toEqual('Mario!!!')
      expect(teamMember.lastName).toEqual('Mario')
      expect(teamMember.email).toEqual('mario@example.com')
    })

    test('cannot edit myself', async () => {
      connection.params = { csrfToken, teamId: team.id, userId: user.id, firstName: 'NewName' }
      const { error } = await api.specHelper.runAction('teamMember:edit', connection)

      expect(error).toEqual('Error: you cannot edit yourself via this method')
    })
  })

  describe('team:members:list', () => {
    test('can list team members sorted by name', async () => {
      connection.params = { csrfToken, teamId: team.id }
      const { error, teamMembers } = await api.specHelper.runAction('teamMembers:list', connection)

      expect(error).toBeUndefined()
      expect(teamMembers.length).toEqual(2)
      expect(teamMembers[1].firstName).toEqual('Peach')
      expect(teamMembers[0].firstName).toEqual('Mario')
    })
  })

  describe('team:members:remove', () => {
    test('cannot remove yourself from the team', async () => {
      connection.params = { csrfToken, teamId: team.id, userId: user.id }
      const { error } = await api.specHelper.runAction('teamMember:destroy', connection)
      expect(error).toEqual('Error: you cannot remove yourself from a team')
    })

    test('can remove a team teamMembers', async () => {
      const mario = await api.models.User.findOne({ where: { email: 'mario@example.com' } })
      connection.params = { csrfToken, teamId: team.id, userId: mario.id }
      const { error, success } = await api.specHelper.runAction('teamMember:destroy', connection)
      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      connection.params = { csrfToken, teamId: team.id }
      const { teamMembers } = await api.specHelper.runAction('teamMembers:list', connection)

      expect(teamMembers.length).toEqual(1)
      expect(teamMembers[0].firstName).toEqual('Peach')
    })
  })
})
