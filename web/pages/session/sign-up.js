import React from 'react'
import { Card } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedOut.js'
import SignUpForm from './../../components/forms/session/signUp'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Sign Up</h1>
        <Card border='success'>
          <Card.Body>
            <SignUpForm />
          </Card.Body>
        </Card>
      </Layout>
    )
  }
}

export default Page
