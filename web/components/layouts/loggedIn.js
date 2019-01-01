import React from 'react'
import PageBase from './base'
import NavbarLoggedIn from './../navbar/loggedIn'
import Footer from './../footer/footer'
import LoggedOutCatcher from './../loggedOutCatcher'

class PageLoggedOut extends React.Component {
  render () {
    return (
      <PageBase>
        <NavbarLoggedIn />
        <br />
        { this.props.children }
        <hr />
        <Footer />
        <LoggedOutCatcher />
      </PageBase>
    )
  }
}

export default PageLoggedOut
