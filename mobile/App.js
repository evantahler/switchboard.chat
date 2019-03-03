import React, { Component } from 'react'
import { Root } from 'native-base'
import localStorageShim from './components/localStorageShim' //eslint-disable-line
import LoggedOutNavigation from './components/navigations/loggedOut'
import LoggedInNavigation from './components/navigations/loggedIn'
import LoadingScene from './components/scenes/loading'
import SuccessAlert from './components/alerts/success'
import ErrorAlert from './components/alerts/error'
import SessionRepository from './../web/repositories/session'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      mode: 'loading'
    }
  }

  componentDidMount () {
    global.__reloadApp = async () => {
      await this.load.bind(this)
    }

    this.load()
  }

  async load () {
    const { localStorage } = global
    let mode = 'signedOut'
    try {
      const sessionResponse = await localStorage.getItem(SessionRepository.key)
      if (sessionResponse) { mode = 'signedIn' }
      this.setState({ mode })
    } catch (error) {
      this.setState({ mode })
    }
  }

  render () {
    const { mode } = this.state

    return (
      <Root>
        <SuccessAlert />
        <ErrorAlert />
        {
          mode === 'loading'
            ? <LoadingScene />
            : mode === 'signedIn'
              ? <LoggedInNavigation />
              : <LoggedOutNavigation />
        }
      </Root>
    )
  }
}
