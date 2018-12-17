import React from 'react'
import PageBase from './base'
import NavbarLoggedOut from './../navbar/loggedOut'
import Footer from './../footer/footer'

class PageLoggedOut extends React.Component {
  render () {
    return (
      <PageBase>
        <NavbarLoggedOut />
        <br />
        { this.props.children }
        <hr />
        <Footer />
      </PageBase>
    )
  }
}

export default PageLoggedOut
