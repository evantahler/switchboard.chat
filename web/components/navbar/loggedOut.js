import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Navbar, Nav, ButtonToolbar, Button, NavDropdown } from 'react-bootstrap'
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
      <Navbar bg='light' variant='light' expand='lg'>
        <Link href='/'><Navbar.Brand>Switchboard ☎️</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <HighlightableNavigationLink href='/'>Home</HighlightableNavigationLink>
            <HighlightableNavigationLink href='/about'>About</HighlightableNavigationLink>
            <NavDropdown title='Industries' id='nav-dropdown'>
              <NavDropdown.Item onClick={() => this.goTo('/industries/education')}>Education</NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.goTo('/industries/real-estate')}>Real Estate</NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.goTo('/industries/logistics')}>Logistics</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <ButtonToolbar>
            <Button variant='outline-secondary' onClick={() => this.goTo('/session/sign-in')}>Sign In</Button>
            &nbsp;
            &nbsp;
            &nbsp;
            <Button variant='outline-success' onClick={() => this.goTo('/session/sign-up')}>Sign Up</Button>
          </ButtonToolbar>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavbarLoggedOut
