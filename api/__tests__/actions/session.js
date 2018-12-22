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
    await api.specHelper.runAction('user:create', {
      firstName: 'Peach',
      lastName: 'Toadstool',
      email: 'peach@example.com',
      password: 'passw0rd'
    })
  })

  describe('session:create', () => {
    test('can log in', async () => {
      let { success, userId, error } = await api.specHelper.runAction('session:create', {
        email: 'peach@example.com',
        password: 'passw0rd'
      })

      expect(error).toBeUndefined()
      expect(success).toEqual(true)
      expect(userId).toBeTruthy()
    })

    test('cannot log in with unknown user', async () => {
      let { success, user, error } = await api.specHelper.runAction('session:create', {
        email: 'fff@example.com',
        password: 'x'
      })

      expect(error).toMatch(/user not found/)
      expect(success).toEqual(false)
      expect(user).toBeUndefined()
    })

    test('cannot log in with bad password', async () => {
      let { success, user, error } = await api.specHelper.runAction('session:create', {
        email: 'peach@example.com',
        password: 'x'
      })

      expect(error).toMatch(/password does not match/)
      expect(success).toEqual(false)
      expect(user).toBeUndefined()
    })
  })

  describe('session:destroy', () => {
    test('can log out', async () => {
      let { success, error, csrfToken } = await api.specHelper.runAction('session:create', {
        email: 'peach@example.com',
        password: 'passw0rd'
      })

      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      let { successAgain = success, errorAgain = error } = await api.specHelper.runAction('session:destroy', {
        csrfToken
      })

      expect(errorAgain).toBeUndefined()
      expect(successAgain).toEqual(true)
    })
  })
})
