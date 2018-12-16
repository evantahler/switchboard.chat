const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
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

  test('a team can create, destroy, and list folders', async () => {
    await team.addFolder('folder 1')
    let folders = await team.folders()
    expect(folders.map((f) => f.name)).toEqual(['folder 1'])

    await team.addFolder('folder 2')
    folders = await team.folders()
    expect(folders.map((f) => f.name)).toEqual(['folder 1', 'folder 2'])

    await team.removeFolder('folder 1')
    folders = await team.folders()
    expect(folders.map((f) => f.name)).toEqual(['folder 2'])
  })

  test('a team can list all users', async () => {
    const user = new api.models.User()
    user.firstName = 'Peach'
    user.lastName = 'Toadstool'
    user.email = 'peach@example.com'
    await user.save()

    const userTeam = new api.models.UserTeam()
    userTeam.teamId = team.id
    userTeam.userId = user.id
    await userTeam.save()

    const users = await team.users()
    expect(users.length).toEqual(1)
    expect(users.map((u) => u.name())).toEqual(['Peach Toadstool'])
  })

  test('a team can list all contacts', async () => {
    const folders = await team.folders()
    const folder = folders[0]

    const contact = new api.models.Contact()
    contact.firstName = 'Bowser'
    contact.lastName = 'Koopa'
    contact.phoneNumber = '1-800-bowser'
    contact.teamId = team.id
    contact.folderId = folder.id

    await contact.save()

    const contacts = await team.contacts(folder.name)
    expect(contacts.length).toEqual(1)
    expect(contacts.map((u) => u.name())).toEqual(['Bowser Koopa'])
  })
})
