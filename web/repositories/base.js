import Client from './../client/client'
import StorageMock from './utils/storageMock'

class BaseRepository {
  constructor () {
    let storage
    if (typeof window !== 'undefined') {
      storage = window.localStorage
    } else {
      storage = new StorageMock()
    }

    this.name = '__base'
    this.client = new Client()
    this.storage = storage
    this.key = undefined
    this.errorHandler = undefined
    this.ttl = 1000 * 60 * 5 // 5 minutes
    this.subscriptions = {}
    this.hydration = {
      verb: 'get',
      path: undefined
    }
  }

  async get () {
    const now = new Date().getTime()
    const response = JSON.parse(this.storage.getItem(this.key))
    if (response && response.data && response.expiresAt > now) {
      return response.data
    } else {
      try {
        await this.hydrate()
        return this.get()
      } catch (error) {
        if (this.errorHandler) {
          this.errorHandler.set(error.toString())
        } else {
          throw error
        }
      }
    }
  }

  async set (data) {
    const now = new Date().getTime()
    await this.storage.setItem(this.key, JSON.stringify({
      expiresAt: now + this.ttl,
      data
    }))
    await this.publish(data)
  }

  async publish (data) {
    const subscriptionKeys = Object.keys(this.subscriptions)
    for (let i in subscriptionKeys) {
      let key = subscriptionKeys[i]
      await this.subscriptions[key](data)
    }
  }

  async hydrate () {
    const response = await this.client.action(this.hydration.verb, this.hydration.path)
    if (response && !response.error) {
      this.set(response)
    } else {
      const errorMessage = response && response.error ? response.error : `cannot hydrate ${this.name}`
      throw new Error(errorMessage)
    }
  }

  subscribe (name, handler) {
    this.subscriptions[name] = handler
  }

  unsubscribe (name) {
    delete this.subscriptions[name]
  }
}

export default BaseRepository
