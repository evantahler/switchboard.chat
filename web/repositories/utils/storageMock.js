class StorageMock {
  constructor () {
    this.storage = {}
  }

  setItem (key, value) {
    this.storage[key] = value || ''
  }

  getItem (key) {
    return key in this.storage ? this.storage[key] : null
  }

  removeItem (key) {
    delete this.storage[key]
  }

  get length () {
    return Object.keys(this.storage).length
  }

  key (i) {
    var keys = Object.keys(this.storage)
    return keys[i] || null
  }
}

export default StorageMock
