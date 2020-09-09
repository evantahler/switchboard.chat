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

describe('folder', () => {
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

  describe('folder:create', () => {
    test('can create a folder', async () => {
      connection.params = {
        csrfToken,
        teamId: team.id,
        name: 'Royal Family'
      }
      const { error, folder: responseFolder } = await api.specHelper.runAction('folder:create', connection)

      expect(error).toBeUndefined()
      expect(responseFolder.name).toEqual('Royal Family')
      folder = responseFolder
    })
  })

  describe('folders:list', () => {
    test('can list folders', async () => {
      connection.params = { csrfToken, teamId: team.id }
      const { error, folders } = await api.specHelper.runAction('folders:list', connection)

      expect(error).toBeUndefined()
      expect(folders.length).toEqual(2)
      expect(folders[0].name).toEqual('default folder')
      expect(folders[1].name).toEqual('Royal Family')
    })
  })

  describe('folder:remove', () => {
    test('can remove a folder', async () => {
      connection.params = { csrfToken, teamId: team.id, folderId: folder.id }
      const { error, success } = await api.specHelper.runAction('folder:destroy', connection)
      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      connection.params = { csrfToken, teamId: team.id }
      const { folders } = await api.specHelper.runAction('folders:list', connection)

      expect(folders.length).toEqual(1)
      expect(folders[0].name).toEqual('default folder')
    })

    test('cannot delete the default folder', async () => {
      connection.params = { csrfToken, teamId: team.id }
      const { folders } = await api.specHelper.runAction('folders:list', connection)

      connection.params = { csrfToken, teamId: team.id, folderId: folders[0].id }
      const { error } = await api.specHelper.runAction('folder:destroy', connection)
      expect(error).toEqual('Error: this folder cannot be deleted')
    })
  })
})
