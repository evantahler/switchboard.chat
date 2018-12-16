const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let user

describe('actionhero Tests', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })

  afterAll(async () => { await actionhero.stop() })

  test('a user must have an email', async () => {
    let user = new api.models.User()
    try {
      await user.save()
      throw new Error('should not get here')
    } catch (error) {
      expect(error.message).toMatch(/User.email cannot be null/)
    }
  })

  test('a valid user can be saved', async () => {
    const peach = new api.models.User()
    peach.firstName = 'Peach'
    peach.lastName = 'Toadstool'
    peach.email = 'peach@example.com'

    await peach.save()
    expect(peach.id).toBeDefined()

    user = peach
  })

  test('user name can be rendered from the first and last name', () => {
    expect(user.name()).toEqual('Peach Toadstool')
  })

  test('user can save and check a password', async () => {
    await user.updatePassword('p@ssword')
    const check = await user.checkPassword('p@ssword')
    expect(check).toBeTruthy()
  })

  test('wrong passwords will fail check', async () => {
    await user.updatePassword('p@ssword')
    const check = await user.checkPassword('nope')
    expect(check).toBeFalsy()
  })

  describe('teams', () => {
    let team1, team2
    beforeAll(async () => {
      team1 = new api.models.Team({
        areaCode: 412,
        name: 'test team',
        pricePerMonth: 100,
        pricePerMessage: 1,
        includedMessagesPerMonth: 0,
        enabled: true
      })

      team2 = new api.models.Team({
        areaCode: 412,
        name: 'other team',
        pricePerMonth: 100,
        pricePerMessage: 1,
        includedMessagesPerMonth: 0,
        enabled: true
      })

      await team1.save()
      await team2.save()
    })

    test('user can be a member of many teams', async () => {
      await user.joinTeam(team1)
      let teams = await user.teams()
      expect(teams.map(t => { return t.name })).toEqual(['test team'])

      await user.joinTeam(team2)
      teams = await user.teams()
      expect(teams.map(t => { return t.name })).toEqual(['test team', 'other team'])
    })

    test('user can leave a team', async () => {
      await user.leaveTeam(team2)
      let teams = await user.teams()
      expect(teams.map(t => { return t.name })).toEqual(['test team'])
    })
  })
})
