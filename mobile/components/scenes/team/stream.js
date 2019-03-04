import React, { Component } from 'react'
import Layout from './../../layouts/layout.js'

export default class Stream extends Component {
  render () {
    return (
      <Layout title={'Stream'} showNavIcon {...this.props} />
    )
  }
}
