import React from 'react'
import Layout from './../../components/layouts/loggedOut.js'
import SignInForm from './../../components/forms/session/signIn'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Log In</h1>
        <SignInForm />
      </Layout>
    )
  }
}

export default Page
