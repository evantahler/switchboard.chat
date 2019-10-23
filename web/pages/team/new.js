import React from 'react'
import { Alert } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import NewTeamForm from './../../components/forms/team/new'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='New Team'>
        <h1>Create new Team</h1>
        <Alert variant='info'>New teams will be billed at $30 per month, and will include 1000 text messages.  Each additional message will cost 1 cent.</Alert>
        <NewTeamForm />
      </Layout>
    )
  }
}

export default Page
