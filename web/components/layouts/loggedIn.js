import React from 'react'
import PageBase from './base'
import NavbarLoggedIn from './../navbar/loggedIn'
import LoggedInFooter from './../footer/loggedIn'
import LoggedOutCatcher from './../loggedOutCatcher'

class PageLoggedOut extends React.Component {
  render () {
    return (
      <PageBase>
        <NavbarLoggedIn />
        <br />
        {this.props.children}
        <hr />
        <LoggedInFooter />
        <LoggedOutCatcher />
      </PageBase>
    )
  }
}

export default PageLoggedOut
