import React from 'react'
import Router from 'next/router'
import Layout from './../components/layouts/loggedOut.js'
import { Jumbotron, Button } from 'react-bootstrap'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <Jumbotron>
          <h1>Switchboard</h1>
          <p>Centralized SMS Communication for Teams</p>
          <p>
            <Button variant='success' onClick={() => Router.push('/sign-up')}>Sign Up</Button>
          </p>
        </Jumbotron>

      </Layout>
    )
  }
}

export default Page
