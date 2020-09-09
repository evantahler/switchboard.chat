const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let user
let team
let folder
let connection
let csrfToken

describe('contact', () => {
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
    expect(csrfToken).toBeTruthy()

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

    connection.params = { csrfToken, name: 'Royal Family', teamId: team.id }
    const createFolderResponse = await api.specHelper.runAction('folder:create', connection)
    folder = createFolderResponse.folder
  })

  afterAll(async () => { await actionhero.stop() })

  describe('contact:create', () => {
    test('can create a contact', async () => {
      connection.params = {
        csrfToken,
        teamId: team.id,
        folderId: folder.id,
        phoneNumber: '(541) 754-3010',
        firstName: 'Toad',
        lastName: 'Toadstool'
      }
      const { error, contact } = await api.specHelper.runAction('contact:create', connection)

      expect(error).toBeUndefined()
      expect(contact.id).toBeTruthy()
      expect(contact.folderId).toEqual(folder.id)
      expect(contact.firstName).toEqual('Toad')
      expect(contact.lastName).toEqual('Toadstool')
    })
  })

  describe('contacts:list', () => {
    test('can list contacts', async () => {
      connection.params = { csrfToken, teamId: team.id, folderId: folder.id }
      const { error, contacts } = await api.specHelper.runAction('contacts:list', connection)

      expect(error).toBeUndefined()
      expect(contacts.length).toEqual(1)
      expect(contacts[0].firstName).toEqual('Toad')
    })
  })

  describe('contact:remove', () => {
    test('can remove a contact', async () => {
      const toad = await api.models.Contact.findOne({ where: { firstName: 'Toad', lastName: 'Toadstool' } })
      connection.params = { csrfToken, teamId: team.id, folderId: folder.id, contactId: toad.id }
      const { error, success } = await api.specHelper.runAction('contact:destroy', connection)
      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      connection.params = { csrfToken, teamId: team.id, folderId: folder.id }
      const { contacts } = await api.specHelper.runAction('contacts:list', connection)

      expect(contacts.length).toEqual(0)
    })
  })
})
