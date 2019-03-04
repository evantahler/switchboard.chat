import React, { Component } from 'react'
import Layout from './../../layouts/layout.js'

export default class TeamMembers extends Component {
  render () {
    return (
      <Layout title={'Team Members'} showNavIcon {...this.props} />
    )
  }
}
