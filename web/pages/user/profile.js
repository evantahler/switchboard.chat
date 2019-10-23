import React from 'react'
import { Card } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import UserEditForm from './../../components/forms/user/edit'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='Profile'>
        <h1>Profile</h1>
        <Card border='success'>
          <Card.Body>
            <UserEditForm />
          </Card.Body>
        </Card>
      </Layout>
    )
  }
}

export default Page
