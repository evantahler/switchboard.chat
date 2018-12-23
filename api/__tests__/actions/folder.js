const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let team
let folder
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
    connection.params = { email: 'peach@example.com', password: 'passw0rd' }

    let sessionResponse = await api.specHelper.runAction('session:create', connection)
    csrfToken = sessionResponse.csrfToken

    connection.params = { csrfToken, name: 'Mushroom Kingdom' }
    let createResponse = await api.specHelper.runAction('team:create', connection)
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
      let { error, folder: responseFolder } = await api.specHelper.runAction('folder:create', connection)

      expect(error).toBeUndefined()
      expect(responseFolder.name).toEqual('Royal Family')
      folder = responseFolder
    })
  })

  describe('folders:list', () => {
    test('can list folders', async () => {
      connection.params = { csrfToken, teamId: team.id }
      let { error, folders } = await api.specHelper.runAction('folders:list', connection)

      expect(error).toBeUndefined()
      expect(folders.length).toEqual(1)
      expect(folders[0].name).toEqual('Royal Family')
    })
  })

  describe('folder:remove', () => {
    test('can remove a folder', async () => {
      connection.params = { csrfToken, teamId: team.id, folderId: folder.id }
      let { error, success } = await api.specHelper.runAction('folder:destroy', connection)
      expect(error).toBeUndefined()
      expect(success).toEqual(true)

      connection.params = { csrfToken, teamId: team.id }
      let { folders } = await api.specHelper.runAction('folders:list', connection)

      expect(folders.length).toEqual(0)
    })
  })
})
