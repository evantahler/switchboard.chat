import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import TeamEditForm from './../../components/forms/team/edit'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Edit Team</h1>
        <TeamEditForm />
      </Layout>
    )
  }
}

export default Page
