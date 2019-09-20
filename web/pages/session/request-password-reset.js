import React from 'react'
import { Card } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedOut.js'
import RequestPasswordResetForm from './../../components/forms/session/requestPasswordReset'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Request Password Reset</h1>
        <Card border='success'>
          <Card.Body>
            <RequestPasswordResetForm />
          </Card.Body>
        </Card>
      </Layout>
    )
  }
}

export default Page
