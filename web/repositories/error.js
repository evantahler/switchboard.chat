import BaseRepository from './base'

class ErrorRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'error'
    this.key = 'repository:error'
    this.responseKeys = ['error']
  }
}

export default new ErrorRepository()
