import Axios from 'axios'
import * as PackgeJSON from './../package.json'

class Client {
  constructor () {
    this.apiEndpoint =
      typeof window !== 'undefined'
        ? window.location.href.match(/localhost/)
          ? `http://localhost:8080`
          : `https://api.switchboard.chat`
        : null
  }

  async test () {
    return this.action({}, '/api/system/status', 'GET')
  }

  async action (verb = 'get', path, data) {
    let options = {
      url: this.apiEndpoint + path,
      credentials: 'include',
      agent: `switchboard-web-${PackgeJSON.version}`,
      method: verb.toLowerCase(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (data) {
      for (let i in data) {
        if (data[i] === null || data[i] === undefined) { delete data[i] }
      }

      if (data.file) {
        delete options.headers
        let dataForm = new FormData() // eslint-disable-line
        for (let i in data) { dataForm.append(i, data[i]) }
        data = dataForm
      }

      if (options.method === 'get') {
        options.params = data
      } else {
        options.data = data
      }
    }

    try {
      const response = await Axios(options)
      if (response.data && response.data.error) { throw response.data.error }
      return response.data
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error)
      } else {
        throw error
      }
    }
  }
}

export default Client
