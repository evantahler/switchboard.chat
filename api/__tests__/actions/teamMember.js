const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let team
let connection
let csrfToken

describe('user', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })
  beforeAll(async () => {
    await api.specHelper.runAction('user:create', {
      firstName: 'Peach',
      lastName: 'Toadstool',
      email: 'peach@example.com',
      password: 'passw0rd'
    })

    connection = new api.specHelper.Connection()
    connection.params = {
      email: 'peach@example.com',
      password: 'passw0rd'
    }

    let sessionResponse = await api.specHelper.runAction('session:create', connection)
    csrfToken = sessionResponse.csrfToken

    connection.params = {
      csrfToken,
      name: 'Mushroom Kingdom'
    }
    let createResponse = await api.specHelper.runAction('team:create', connection)

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
      let { error, teamMember } = await api.specHelper.runAction('teamMember:create', connection)

      expect(error).toBeUndefined()
      expect(teamMember.id).toBeTruthy()
      expect(teamMember.userId).toBeTruthy()
      expect(teamMember.teamId).toBeTruthy()
    })
  })

  describe('team:members:list', () => {
    test('can list team members', async () => {
      connection.params = { csrfToken, teamId: team.id }
      let { error, teamMembers } = await api.specHelper.runAction('teamMember:list', connection)

      expect(error).toBeUndefined()
      expect(teamMembers.length).toEqual(2)
      expect(teamMembers[0].firstName).toEqual('Peach')
      expect(teamMembers[1].firstName).toEqual('Mario')
    })
  })

  describe('team:members:remove', () => {
    test('can remove a team teamMembers', async () => {
      const mario = await api.models.User.findOne({ where: { email: 'mario@example.com' } })
      connection.params = { csrfToken, teamId: team.id, userId: mario.id }
      let { error, success } = await api.specHelper.runAction('teamMember:remove', connection)
      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      connection.params = { csrfToken, teamId: team.id }
      let { teamMembers } = await api.specHelper.runAction('teamMember:list', connection)

      expect(teamMembers.length).toEqual(1)
      expect(teamMembers[0].firstName).toEqual('Peach')
    })
  })
})
