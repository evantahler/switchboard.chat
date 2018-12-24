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
    let userResponse = await api.specHelper.runAction('user:create', {
      firstName: 'Peach',
      lastName: 'Toadstool',
      email: 'peach@example.com',
      password: 'passw0rd'
    })
    user = userResponse.user

    connection = new api.specHelper.Connection()
    connection.params = {
      email: 'peach@example.com',
      password: 'passw0rd'
    }

    let sessionResponse = await api.specHelper.runAction('session:create', connection)
    csrfToken = sessionResponse.csrfToken
  })

  afterAll(async () => { await actionhero.stop() })

  describe('team:create', () => {
    test('can create a team', async () => {
      connection.params = {
        csrfToken,
        userId: user.id,
        name: 'Mushroom Kingdom'
      }
      let createResponse = await api.specHelper.runAction('team:create', connection)

      team = createResponse.team
      let error = createResponse.error

      expect(error).toBeUndefined()
      expect(team.id).toBeTruthy()
      expect(team.name).toEqual('Mushroom Kingdom')
      expect(team.enabled).toEqual(true)
      expect(team.pricePerMonth).toEqual(3000)
      expect(team.pricePerMessage).toEqual(1)
      expect(team.includedMessagesPerMonth).toEqual(1000)
    })

    test('can cannot create a team with no name', async () => {
      connection.params = { csrfToken }
      let { error } = await api.specHelper.runAction('team:create', connection)

      expect(error).toMatch(/name is a required parameter for this action/)
    })

    test('can cannot create a team with a duplicate name', async () => {
      connection.params = { csrfToken, name: 'Mushroom Kingdom' }
      let { error } = await api.specHelper.runAction('team:create', connection)

      expect(error).toMatch(/Validation error/)
    })
  })

  describe('team:view', () => {
    test('can view my team', async () => {
      connection.params = { csrfToken, teamId: team.id }
      let { responseTeam = team, error } = await api.specHelper.runAction('team:view', connection)

      expect(error).toBeUndefined()
      expect(responseTeam.id).toBeTruthy()
      expect(responseTeam.name).toEqual('Mushroom Kingdom')
      expect(responseTeam.enabled).toEqual(true)
      expect(responseTeam.pricePerMonth).toEqual(3000)
      expect(responseTeam.pricePerMessage).toEqual(1)
      expect(responseTeam.includedMessagesPerMonth).toEqual(1000)
    })

    test('cannot view a team I am not a membr of', async () => {
      const otherTeam = new api.models.Team({ name: 'Team Koopa' })
      await otherTeam.save()

      connection.params = { csrfToken, teamId: otherTeam.id }
      let { error } = await api.specHelper.runAction('team:view', connection)

      expect(error).toMatch(/no/)
    })
  })

  describe('teams:list', () => {
    test('can list my teams', async () => {
      connection.params = { csrfToken }
      let { teams, error } = await api.specHelper.runAction('teams:list', connection)

      expect(error).toBeUndefined()
      expect(teams.length).toEqual(1)
      expect(teams[0].id).toBeTruthy()
      expect(teams[0].name).toEqual('Mushroom Kingdom')
      expect(teams[0].enabled).toEqual(true)
    })
  })

  describe('team:teamEdit', () => {
    test('can edit a team I am a member of, but not protected attributes', async () => {
      connection.params = {
        csrfToken,
        teamId: team.id,
        name: 'Mushroom Kingdom!',
        pricePerMonth: 1
      }
      let response = await api.specHelper.runAction('team:edit', connection)

      let responseTeam = response.team
      let error = response.error

      expect(error).toBeUndefined()
      expect(responseTeam.id).toBeTruthy()
      expect(responseTeam.name).toEqual('Mushroom Kingdom!')
      expect(responseTeam.enabled).toEqual(true)
      expect(responseTeam.pricePerMonth).toEqual(3000)
      expect(responseTeam.pricePerMessage).toEqual(1)
      expect(responseTeam.includedMessagesPerMonth).toEqual(1000)
    })
  })
})
