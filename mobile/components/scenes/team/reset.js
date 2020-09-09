import React, { Component } from 'react'
import { Icon } from 'native-base'
import Teams from './../teams'

export default class TeamsWithReset extends Component {
  static navigationOptions () {
    return {
      drawerLabel: 'Teams',
      drawerIcon: <Icon name='home' />
    }
  }

  render () {
    const { navigation } = this.props
    return <Teams navigation={navigation} reset />
  }
}
