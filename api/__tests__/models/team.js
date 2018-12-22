const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const helper = new SpecHelper()
const actionhero = new ActionHero.Process()
let api
let team
let user

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

  test('a team can list all members', async () => {
    user = new api.models.User()
    user.firstName = 'Peach'
    user.lastName = 'Toadstool'
    user.email = 'peach@example.com'
    await user.save()

    const teamMember = new api.models.TeamMember()
    teamMember.teamId = team.id
    teamMember.userId = user.id
    await teamMember.save()

    const users = await team.teamMembers()
    expect(users.length).toEqual(1)
    expect(users.map((u) => u.name())).toEqual(['Peach Toadstool'])
  })

  test('a team can add a member by email (new)', async () => {
    await team.addTeamMember({ email: 'mario@example.com', firstName: 'Mario', lastName: 'Mario' })
    const teamMembers = await team.teamMembers()
    expect(teamMembers.length).toEqual(2)
    expect(teamMembers[1].email).toEqual('mario@example.com')

    const mario = await api.models.User.findOne({ where: { email: 'mario@example.com' } })
    expect(mario.id).toBeTruthy()
  })

  test('a team can add a member by email (existing)', async () => {
    const luigi = new api.models.User()
    luigi.firstName = 'Luigi'
    luigi.lastName = 'Mario'
    luigi.email = 'luigi@example.com'
    await luigi.save()

    await team.addTeamMember({ email: 'luigi@example.com' })
    const teamMembers = await team.teamMembers()
    expect(teamMembers.length).toEqual(3)
    expect(teamMembers[2].email).toEqual('luigi@example.com')
  })

  test('a team can add a member by userID', async () => {
    const toad = new api.models.User()
    toad.firstName = 'Toad'
    toad.lastName = 'Toadstool'
    toad.email = 'toad@example.com'
    await toad.save()

    await team.addTeamMember({ userId: toad.id })
    const teamMembers = await team.teamMembers()
    expect(teamMembers.length).toEqual(4)
    expect(teamMembers[3].email).toEqual('toad@example.com')
  })

  test('a team can remove a member', async () => {
    const mario = await api.models.User.findOne({ where: { email: 'mario@example.com' } })
    await team.removeTeamMember(mario.id)
    const teamMembers = await team.teamMembers()
    expect(teamMembers.length).toEqual(3)
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
