import React, { Component } from 'react'
import Layout from './../../layouts/layout.js'
import StreamList from './../../lists/stream'
import FoldersList from './../../lists/folders'

export default class Stream extends Component {
  render () {
    return (
      <Layout title={'Stream'} showNavIcon {...this.props} >
        <FoldersList {...this.props} />
        <StreamList {...this.props} />
      </Layout>
    )
  }
}
