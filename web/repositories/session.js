import BaseRepository from './base'
import ErrorRepository from './error'
import SuccessRepository from './success'

class SessionRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'session'
    this.key = 'repository:session'
    this.ttl = 1000 * 60 * 60 * 24 * 30 // 1 month
    this.responseKeys = ['csrfToken', 'userId', 'team', 'folder']
    this.routes.create.path = '/api/session'
    this.routes.destroy.path = '/api/session'
  }

  async requestPasswordReset (data) {
    const params = await this.mergeAdditionalParams(data)
    await this.client.action('put', '/api/user/requestResetPassword', params)
    SuccessRepository.set({ message: 'If your email is registered, we will send you reset instructions.' })
    return true
  }

  async updatePassword (data) {
    const params = await this.mergeAdditionalParams(data)
    try {
      await this.client.action('put', '/api/user/resetPassword', params)
      return true
    } catch (error) {
      this.errorHandler.set({ error })
    }
  }
}

const repository = new SessionRepository()
repository.errorHandler = ErrorRepository
export default repository
