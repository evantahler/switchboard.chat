import React, { Component } from 'react'
import { Root } from 'native-base'
import localStorageShim from './components/localStorageShim' //eslint-disable-line

import Navigation from './components/navigation'
import SuccessAlert from './components/alerts/success'
import ErrorAlert from './components/alerts/error'

export default class App extends Component {
  render () {
    return (
      <Root>
        <SuccessAlert />
        <ErrorAlert />
        <Navigation />
      </Root>
    )
  }
}
