import React from 'react'
import PageBase from './base'
import NavbarLoggedOut from './../navbar/loggedOut'
import LoggedOutFooter from './../footer/loggedOut'

class PageLoggedOut extends React.Component {
  render () {
    return (
      <PageBase pageTitle={this.props.pageTitle}>
        <NavbarLoggedOut />
        <br />
        {this.props.children}
        <hr />
        <LoggedOutFooter />
      </PageBase>
    )
  }
}

export default PageLoggedOut
