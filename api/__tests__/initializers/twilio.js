const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const actionhero = new ActionHero.Process()
const helper = new SpecHelper()

let api
let user
let connection
let csrfToken

describe('twilio', () => {
  beforeAll(async () => { api = await actionhero.start() })
  beforeAll(async () => { await helper.truncate() })
  beforeAll(async () => {
    let userResponse = await api.specHelper.runAction('user:create', {
      firstName: 'Peach',
      lastName: 'Toadstool',
      email: 'peach@example.com',
      password: 'passw0rd'
    })
    user = await api.models.User.findOne({ where: { id: userResponse.user.id } })

    connection = new api.specHelper.Connection()
    connection.params = {
      email: 'peach@example.com',
      password: 'passw0rd'
    }

    let sessionResponse = await api.specHelper.runAction('session:create', connection)
    csrfToken = sessionResponse.csrfToken
  })

  afterAll(async () => { await actionhero.stop() })

  test('placeholder', () => {
    // Cannot run this test suite without using real credentials...
    expect(true).toEqual(true)
    expect(user).toBeTruthy()
    expect(csrfToken).toBeTruthy()
  })

  // test('twilio can provide available phone numbers', async () => {
  //   const phoneNumbers = await api.twilio.listPhoneNumbers('412')
  //   console.log(phoneNumbers)
  // })
})
