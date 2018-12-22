const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api

describe('user', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })

  afterAll(async () => { await actionhero.stop() })

  describe('user:create', () => {
    test('can create a user', async () => {
      let { user, error } = await api.specHelper.runAction('user:create', {
        firstName: 'Peach',
        lastName: 'Toadstool',
        email: 'peach@example.com',
        password: 'passw0rd'
      })

      expect(error).toBeUndefined()
      expect(user.id).toBeTruthy()
      expect(user.firstName).toEqual('Peach')
      expect(user.lastName).toEqual('Toadstool')
      expect(user.email).toEqual('peach@example.com')
      expect(user.password).toBeUndefined()
    })

    test('can create a user with an optional phone Number', async () => {
      let { user, error } = await api.specHelper.runAction('user:create', {
        firstName: 'Mario',
        lastName: 'Mario',
        email: 'mario@example.com',
        password: 'passw0rd',
        phoneNumber: '415-413-8268‬'
      })

      expect(error).toBeUndefined()
      expect(user.id).toBeTruthy()
      expect(user.firstName).toEqual('Mario')
      expect(user.lastName).toEqual('Mario')
      expect(user.email).toEqual('mario@example.com')
      expect(user.phoneNumber).toEqual('+1 415 413 8268')
      expect(user.password).toBeUndefined()
    })

    test('email addresses must be valid', async () => {
      let { error } = await api.specHelper.runAction('user:create', {
        firstName: 'Bowser',
        lastName: 'Koopa',
        email: 'bowser.example.com',
        password: 'passw0rd'
      })

      expect(error).toMatch(/failed validation/)
    })

    test('passwords must be at least 6 chars long', async () => {
      let { error } = await api.specHelper.runAction('user:create', {
        firstName: 'Bowser',
        lastName: 'Koopa',
        email: 'bowser@example.com',
        password: 'p'
      })

      expect(error).toMatch(/failed validation/)
    })
  })

  describe('user:view', () => {
    test('user can view themselves', async () => {
      const connection = new api.specHelper.Connection()
      connection.params = {
        email: 'peach@example.com',
        password: 'passw0rd'
      }
      let { csrfToken } = await api.specHelper.runAction('session:create', connection)

      connection.params = { csrfToken }
      let { error, user } = await api.specHelper.runAction('user:view', connection)

      expect(error).toBeUndefined()
      expect(user.id).toBeTruthy()
      expect(user.firstName).toEqual('Peach')
      expect(user.lastName).toEqual('Toadstool')
      expect(user.email).toEqual('peach@example.com')
      expect(user.password).toBeUndefined()
    })
  })

  describe('user:edit', () => {
    test('user can edit themselves', async () => {
      const connection = new api.specHelper.Connection()
      connection.params = {
        email: 'peach@example.com',
        password: 'passw0rd'
      }
      let { csrfToken } = await api.specHelper.runAction('session:create', connection)

      connection.params = { csrfToken, firstName: 'SuperPeach' }
      let { error, user } = await api.specHelper.runAction('user:edit', connection)

      expect(error).toBeUndefined()
      expect(user.id).toBeTruthy()
      expect(user.firstName).toEqual('SuperPeach')
      expect(user.lastName).toEqual('Toadstool')
      expect(user.email).toEqual('peach@example.com')
      expect(user.password).toBeUndefined()
    })
  })
})
