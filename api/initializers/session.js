const { api, Initializer } = require('actionhero')
const crypto = require('crypto')

const randomBytesAsync = function (bytes = 64) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (error, buf) => {
      if (error) { return reject(error) }
      return resolve(buf.toString('hex'))
    })
  })
}

module.exports = class MyInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'session'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    const redis = api.redis.clients.client

    api.session = {
      prefix: 'session',
      ttl: 1000 * 60 * 60 * 24 * 30, // 1 month

      key: (connection) => {
        return `${api.session.prefix}:${connection.fingerprint}`
      },

      load: async (connection) => {
        const key = api.session.key(connection)
        const data = await redis.get(key)
        if (!data) { return false }
        return JSON.parse(data)
      },

      create: async (connection, user) => {
        const key = api.session.key(connection)
        const csrfToken = await randomBytesAsync()

        const sessionData = {
          userId: user.id,
          teamId: user.teamId,
          csrfToken: csrfToken,
          sesionCreatedAt: new Date().getTime()
        }

        await user.update({ lastLoginAt: new Date() })
        await redis.set(key, JSON.stringify(sessionData))
        await redis.expire(key, api.session.ttl)
        return sessionData
      },

      destroy: async (connection) => {
        const key = api.session.key(connection)
        await redis.del(key)
      }
    }
  }

  async start () {
    const redis = api.redis.clients.client

    const sessionMiddleware = {
      name: 'logged-in-session',
      global: false,
      priority: 1000,
      preProcessor: async (data) => {
        const sessionData = await api.session.load(data.connection)
        if (!sessionData) {
          throw new Error('Please log in to continue')
        } else if (data.connection.session && data.connection.session.csrfToken === sessionData.csrfToken) {
          data.session = sessionData
        } else if (!data.params.csrfToken || data.params.csrfToken !== sessionData.csrfToken) {
          throw new Error('CSRF error')
        } else {
          data.session = sessionData
          const key = api.session.key(data.connection)
          await redis.expire(key, api.session.ttl)
        }
      }
    }

    api.actions.addMiddleware(sessionMiddleware)

    api.params.globalSafeParams.push('csrfToken')
  }
}
