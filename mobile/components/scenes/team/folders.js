import React, { Component } from 'react'
import Layout from './../../layouts/layout.js'

export default class Folders extends Component {
  render () {
    return (
      <Layout title={'Folders'} showNavIcon {...this.props} />
    )
  }
}
