import React from 'react'
import Router from 'next/router'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import HighlightableNavigationLink from './highlightableNavigationLink'

class NavbarLoggedOut extends React.Component {
  async goTo (path) {
    try {
      await Router.push(path)
    } catch (error) {
      window.location.href = path
    }
  }

  render () {
    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand href='/'>Switchboard ☎️</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <HighlightableNavigationLink href='/'>...</HighlightableNavigationLink>
          </Nav>
          <Nav className='justify-content-end'>
            <NavDropdown title='Settings' id='nav-dropdown' className='mr-right'>
              <NavDropdown.Item onClick={() => this.goTo('/user/profile')}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.goTo('/user/teams')}>Teams</NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.goTo('/session/sign-out')}>Sign Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavbarLoggedOut
