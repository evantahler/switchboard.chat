import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import TeamsList from './../../components/lists/teams'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Your Teams</h1>
        <TeamsList />
      </Layout>
    )
  }
}

export default Page
