import React from 'react'
import PageBase from './base'
import NavbarLoggedIn from './../navbar/loggedIn'
import Footer from './../footer/footer'

class PageLoggedOut extends React.Component {
  render () {
    return (
      <PageBase>
        <NavbarLoggedIn />
        <br />
        { this.props.children }
        <hr />
        <Footer />
      </PageBase>
    )
  }
}

export default PageLoggedOut
