import BaseRepository from './base'

class SuccessRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'success'
    this.key = 'repository:success'
    this.responseKeys = ['message']
    this.ttl = 5 * 1000 // 5 seconds
  }
}

export default new SuccessRepository()
