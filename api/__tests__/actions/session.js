const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api

describe('serssion', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })

  afterAll(async () => { await actionhero.stop() })

  beforeAll(async () => {
    await api.specHelper.runAction('userCreate', {
      firstName: 'Peach',
      lastName: 'Toadstool',
      email: 'peach@example.com',
      password: 'passw0rd'
    })
  })

  describe('sessionCreate', () => {
    test('can log in', async () => {
      let { success, user, error } = await api.specHelper.runAction('sessionCreate', {
        email: 'peach@example.com',
        password: 'passw0rd'
      })

      expect(error).toBeUndefined()

      expect(success).toEqual(true)

      expect(user.id).toBeTruthy()
      expect(user.firstName).toEqual('Peach')
      expect(user.lastName).toEqual('Toadstool')
      expect(user.email).toEqual('peach@example.com')
      expect(user.password).toBeUndefined()
    })

    test('cannot log in with bad password', async () => {
      let { success, user, error } = await api.specHelper.runAction('sessionCreate', {
        email: 'peach@example.com',
        password: 'x'
      })

      expect(error).toBeUndefined()
      expect(success).toEqual(false)
      expect(user).toBeUndefined()
    })
  })

  describe('sessionDestroy', () => {
    test('can log out', async () => {
      let { success, error, csrfToken } = await api.specHelper.runAction('sessionCreate', {
        email: 'peach@example.com',
        password: 'passw0rd'
      })

      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      let { successAgain = success, errorAgain = error } = await api.specHelper.runAction('sessionDestroy', {
        csrfToken
      })

      expect(errorAgain).toBeUndefined()
      expect(successAgain).toEqual(true)
    })
  })
})
