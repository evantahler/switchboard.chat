import React from 'react'
import Layout from './../components/layouts/loggedOut.js'
import SignUpForm from './../components/forms/signUp'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Sign Up</h1>
        <SignUpForm />
      </Layout>
    )
  }
}

export default Page
