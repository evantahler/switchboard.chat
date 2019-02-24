import React from 'react'
import Layout from './../../components/layouts/loggedOut.js'
import RequestPasswordResetForm from './../../components/forms/session/requestPasswordReset'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Request Password Reset</h1>
        <RequestPasswordResetForm />
      </Layout>
    )
  }
}

export default Page
