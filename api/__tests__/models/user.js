const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let user
let team

describe('actionhero Tests', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })
  beforeAll(async () => {
    team = new api.models.Team({
      areaCode: 412,
      name: 'test team',
      pricePerMonth: 100,
      pricePerMessage: 1,
      includedMessagesPerMonth: 0,
      enabled: true
    })

    await team.save()
  })

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
    peach.teamId = team.id

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
})
