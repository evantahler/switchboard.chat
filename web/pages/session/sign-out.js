import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import SignOutForm from './../../components/forms/session/signOut'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Signing Out...</h1>
        <SignOutForm />
      </Layout>
    )
  }
}

export default Page
