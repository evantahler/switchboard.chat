import React, { Component } from 'react'
import Layout from './../../layouts/layout.js'

export default class Settings extends Component {
  render () {
    return (
      <Layout title={'Settings'} showNavIcon {...this.props} />
    )
  }
}
