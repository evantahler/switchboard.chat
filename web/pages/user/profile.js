import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import ProfileForm from './../../components/forms/user/profile'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>Profile</h1>
        <ProfileForm />
      </Layout>
    )
  }
}

export default Page
