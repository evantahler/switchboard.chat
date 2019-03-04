import React, { Component } from 'react'
import Layout from './../layouts/layout.js'
import { Card, CardItem } from 'native-base'
import SignInForm from './../forms/session/signIn'

export default class SignIn extends Component {
  render () {
    return (
      <Layout title='Sign In'>
        <Card>
          <CardItem>
            <SignInForm
              style={{ width: '100%' }}
              {...this.props}
            />
          </CardItem>
        </Card>
      </Layout>
    )
  }
}
