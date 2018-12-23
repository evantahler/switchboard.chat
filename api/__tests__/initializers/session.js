const ActionHero = require('actionhero')
const SpecHelper = require('./../specHelper')

const actionhero = new ActionHero.Process()
const helper = new SpecHelper()

let api
let user
let connection
let csrfToken
let key

const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

describe('status', () => {
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

  test('session keys are created', async () => {
    key = api.session.key(connection)
    expect(key).toEqual(`session:${connection.fingerprint}`)
  })

  test('when creating a session, it will persist for the ttl', async () => {
    const session = await api.session.create(connection, user)
    expect(session.userId).toEqual(user.id)
    expect(session.csrfToken).not.toEqual(csrfToken)

    const ttl = await api.redis.clients.client.ttl(key)
    expect(ttl).toEqual(api.session.ttl)
  })

  test('ttl reduces over time', async () => {
    await sleep(1000)
    const ttl = await api.redis.clients.client.ttl(key)
    expect(ttl).toBeLessThan(api.session.ttl)
  })

  test('session data can be loaded', async () => {
    const session = await api.session.load(connection)
    expect(session.userId).toEqual(user.id)
  })

  test('when checking a session, the ttl is extended', async () => {
    const ttl = await api.redis.clients.client.ttl(key)
    expect(ttl).toEqual(api.session.ttl)
  })
})
