import React from 'react'
import Layout from './../../components/layouts/loggedOut.js'
import ResetPasswordForm from './../../components/forms/session/resetPassword'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Reset Password</h1>
        <ResetPasswordForm />
      </Layout>
    )
  }
}

export default Page
