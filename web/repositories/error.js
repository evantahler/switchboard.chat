import BaseRepository from './base'

class ErrorRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'error'
    this.key = 'repository:error'

    // this repository doesn't go online
    delete this.hydration.method
    delete this.hydration.path
  }
}

export default new ErrorRepository()
