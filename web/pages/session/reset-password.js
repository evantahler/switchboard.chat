import React from 'react'
import { Card } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedOut.js'
import ResetPasswordForm from './../../components/forms/session/resetPassword'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='Reset Password'>
        <h1>Reset Password</h1>
        <Card border='success'>
          <Card.Body>
            <ResetPasswordForm />
          </Card.Body>
        </Card>
      </Layout>
    )
  }
}

export default Page
