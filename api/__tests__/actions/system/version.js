const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()
let api

describe('status', () => {
  beforeAll(async () => { api = await actionhero.start() })
  afterAll(async () => { await actionhero.stop() })

  test('can retrieve server version', async () => {
    const {
      sha,
      id,
      actionheroVersion,
      name,
      description,
      version
    } = await api.specHelper.runAction('system:version')

    expect(sha).toBeTruthy()
    expect(id).toBeTruthy()
    expect(actionheroVersion).toBeTruthy()
    expect(name).toEqual('switchboard-api')
    expect(description).toEqual('Phonez')
    expect(version).toBeTruthy()
  })
})
