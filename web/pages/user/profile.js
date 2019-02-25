import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import UserEditForm from './../../components/forms/user/edit'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Profile</h1>
        <UserEditForm />
      </Layout>
    )
  }
}

export default Page
