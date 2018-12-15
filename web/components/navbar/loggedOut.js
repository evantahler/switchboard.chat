import React from 'react'
import Router from 'next/router'
import { Navbar, Nav, ButtonToolbar, Button, NavDropdown } from 'react-bootstrap'
import HighlightableNavigationLink from './highlightableNavigationLink'

class NavbarLoggedOut extends React.Component {
  render () {
    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand href='/'>Switchboard ☎️</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <HighlightableNavigationLink href='/'>Home</HighlightableNavigationLink>
            <HighlightableNavigationLink href='/about'>About</HighlightableNavigationLink>
            <NavDropdown title='Industries' id='nav-dropdown'>
              <NavDropdown.Item href='/industries/education'>Education</NavDropdown.Item>
              <NavDropdown.Item href='/industries/real-estate'>Real Estate</NavDropdown.Item>
              <NavDropdown.Item href='/industries/logistics'>Logistics</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <ButtonToolbar>
            <Button variant='outline-secondary' onClick={() => Router.push('/log-in')}>Log In</Button>
            &nbsp;
            &nbsp;
            &nbsp;
            <Button variant='outline-success' onClick={() => Router.push('/sign-up')}>Sign Up</Button>
          </ButtonToolbar>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavbarLoggedOut
