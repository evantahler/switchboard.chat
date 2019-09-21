import React from 'react'
import { Card } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedOut.js'
import SignInForm from './../../components/forms/session/signIn'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Sign In</h1>
        <Card border='success'>
          <Card.Body>
            <SignInForm />
          </Card.Body>
        </Card>
      </Layout>
    )
  }
}

export default Page
