import React, { Component } from 'react'
import { Icon } from 'native-base'
import Layout from './../layouts/layout.js'
import TeamsList from './../lists/teams'

export default class Teams extends Component {
  static navigationOptions () {
    return {
      drawerLabel: 'Teams',
      drawerIcon: <Icon name='home' />
    }
  }

  render () {
    return (
      <Layout title={'Teams'} showNavIcon {...this.props}>
        <TeamsList {...this.props} />
      </Layout>
    )
  }
}
