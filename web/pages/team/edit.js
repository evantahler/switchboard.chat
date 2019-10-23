import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import TeamEditForm from './../../components/forms/team/edit'
import TeamChargeHistory from './../../components/lists/teamChargeHistory'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='Edit Team'>
        <h1>Edit Team</h1>
        <TeamEditForm />
        <hr />
        <h2>Charge History</h2>
        <TeamChargeHistory />
      </Layout>
    )
  }
}

export default Page
