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
      billingEmail: 'example@example.com',
      pricePerMonth: 100,
      pricePerMessage: 1,
      includedMessagesPerMonth: 0
    })

    await team.save()
  })

  afterAll(async () => { await actionhero.stop() })

  test('a contact can have a name', async () => {
    await team.addFolder('folder 1')

    const folders = await team.folders()
    const folder = folders[0]

    const contact = new api.models.Contact()
    contact.firstName = 'Bowser'
    contact.lastName = 'Koopa'
    contact.phoneNumber = '1-800-bowser'
    contact.teamId = team.id
    contact.folderId = folder.id

    await contact.save()
    expect(contact.name()).toEqual('Bowser Koopa')
  })
})
