import React, { Component } from 'react'
import Layout from './../../layouts/layout.js'

export default class Contacts extends Component {
  render () {
    return (
      <Layout title={'Contacts'} showNavIcon {...this.props} />
    )
  }
}
