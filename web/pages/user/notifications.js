import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import NotificationsEditForm from './../../components/forms/notifications/edit'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='Notifications'>
        <h1>Notificaions</h1>
        <NotificationsEditForm />
      </Layout>
    )
  }
}

export default Page
