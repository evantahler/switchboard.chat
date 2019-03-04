import React, { Component } from 'react'
import { Icon } from 'native-base'

export default class SignOut extends Component {
  static navigationOptions () {
    return {
      drawerLabel: 'Sign Out',
      drawerIcon: <Icon name='log-out' />
    }
  }

  async componentDidMount () {
    await this.clearLocalStorage()
  }

  async clearLocalStorage () {
    const { localStorage } = global
    const { navigation } = this.props

    await localStorage.clear()
    navigation.navigate('Loading')
  }

  render () {
    return null
  }
}
