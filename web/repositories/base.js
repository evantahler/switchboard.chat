import Client from './../client/client'
import StorageMock from './utils/storageMock'

class BaseRepository {
  constructor () {
    let storage
    if (typeof window !== 'undefined' && window.localStorage) {
      storage = window.localStorage
    } else {
      storage = new StorageMock()
    }

    this.name = '__base'
    this.client = new Client()
    this.storage = storage
    this.responseKeys = []
    this.key = undefined
    this.errorHandler = undefined
    this.successHandler = undefined
    this.ttl = 1000 * 60 * 5 // 5 minutes
    this.subscriptions = {}
    this.includeParamsInRequests = undefined

    this.loading = false

    this.routes = {
      get: {
        verb: 'get',
        path: undefined
      },
      update: {
        verb: 'post',
        path: undefined
      },
      destroy: {
        verb: 'delete',
        path: undefined
      },
      create: {
        verb: 'put',
        path: undefined
      }
    }
  }

  async sleep (wait = 1000) {
    return new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
  }

  async ensureNotParalell (next, wait = 1000) {
    if (this.loading) {
      await this.sleep(wait)
      return this.ensureNotParalell(next, wait)
    }

    this.loading = true
    await next()
    this.loading = false
  }

  async get (params) {
    const now = new Date().getTime()
    const response = JSON.parse(this.storage.getItem(this.key))
    if (response && response.data && response.expiresAt > now) {
      return response.data
    } else {
      try {
        await this.hydrate(params)
        return this.get()
      } catch (error) {
        if (this.errorHandler) {
          this.errorHandler.set({ error: error.toString() })
        } else {
          throw error
        }
      }
    }
  }

  async set (data) {
    const now = new Date().getTime()
    let cleanedData = {}
    const keys = Object.keys(data)
    for (let i in keys) {
      let k = keys[i]
      if (this.responseKeys.indexOf(k) >= 0) { cleanedData[k] = data[k] }
    }

    await this.storage.setItem(this.key, JSON.stringify({
      expiresAt: now + this.ttl,
      data: cleanedData
    }))

    await this.publish(cleanedData)
  }

  async remove () {
    await this.storage.removeItem(this.key)
    await this.publish(null)
  }

  async publish (data) {
    const subscriptionKeys = Object.keys(this.subscriptions)
    for (let i in subscriptionKeys) {
      let key = subscriptionKeys[i]
      await this.subscriptions[key](data)
    }
  }

  async hydrate (params = {}) {
    await this.ensureNotParalell(async () => {
      params = await this.mergeAdditionalParams(params)

      try {
        const response = await this.client.action(this.routes.get.verb, this.routes.get.path, params)
        this.set(response)
      } catch (error) {
        const errorMessage = error.message ? error.message : `cannot hydrate ${this.name}`
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
    })
  }

  async create (params = {}) {
    params = await this.mergeAdditionalParams(params)

    try {
      const response = await this.client.action(this.routes.create.verb, this.routes.create.path, params)
      await this.set(response)
      if (this.successHandler) { this.successHandler.set({ message: `Created ${this.name}` }) }
      await this.publish(response)
      return this.get()
    } catch (error) {
      const errorMessage = error.message ? error.message : `cannot create ${this.name}`
      if (this.errorHandler) {
        this.errorHandler.set({ error: errorMessage })
        return false
      } else {
        throw error
      }
    }
  }

  async update (params = {}) {
    params = await this.mergeAdditionalParams(params)

    try {
      const response = await this.client.action(this.routes.update.verb, this.routes.update.path, params)
      this.set(response)
      if (this.successHandler) { this.successHandler.set({ message: `Updated ${this.name}` }) }
      await this.publish(response)
      return response
    } catch (error) {
      const errorMessage = error.message ? error.message : `cannot update ${this.name}`
      if (this.errorHandler) {
        this.errorHandler.set({ error: errorMessage })
        return false
      } else {
        throw error
      }
    }
  }

  async destroy (params = {}) {
    params = await this.mergeAdditionalParams(params)

    try {
      const response = await this.client.action(this.routes.destroy.verb, this.routes.destroy.path, params)
      this.remove(response)
      if (this.successHandler) { this.successHandler.set({ message: `Destroyed ${this.name}` }) }
      await this.publish(response)
      return true
    } catch (error) {
      const errorMessage = error.message ? error.message : `cannot remove ${this.name}`
      if (this.errorHandler) {
        this.errorHandler.set({ error: errorMessage })
        return false
      } else {
        throw error
      }
    }
  }

  subscribe (name, handler) {
    this.subscriptions[name] = handler
  }

  unsubscribe (name) {
    delete this.subscriptions[name]
  }

  async mergeAdditionalParams (params) {
    if (typeof this.includeParamsInRequests === 'function') {
      let additionalParams = await this.includeParamsInRequests()
      for (let i in additionalParams) { params[i] = additionalParams[i] }
    }
    return params
  }
}

export default BaseRepository
