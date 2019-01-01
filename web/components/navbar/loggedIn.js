import React from 'react'
import Router from 'next/router'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import HighlightableNavigationLink from './highlightableNavigationLink'
import SessionRepository from './../../repositories/session'
import TeamsRepository from './../../repositories/teams'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import MessageRepository from './../../repositories/message'
import FoldersRepository from './../../repositories/folders'
import TeamMemberRepository from './../../repositories/teamMember'
import TeamMembersRepository from './../../repositories/teamMembers'

class NavbarLoggedIn extends React.Component {
  constructor () {
    super()
    this.state = { teams: [], team: {} }
  }

  async componentDidMount () {
    this.loadTeams()
    this.loadSessionTeam()
  }

  async loadTeams () {
    const response = await TeamsRepository.get()
    if (response) { this.setState({ teams: response.teams }) }
  }

  async loadSessionTeam () {
    const sessionResponse = await SessionRepository.get()
    if (sessionResponse && sessionResponse.team) { this.setState({ team: sessionResponse.team }) }
  }

  async setTeam (team) {
    await ContactsRepository.remove()
    await ContactRepository.remove()
    await MessagesRepository.remove()
    await MessageRepository.remove()
    await FoldersRepository.remove()
    await TeamMemberRepository.remove()
    await TeamMembersRepository.remove()

    let session = await SessionRepository.get()
    session.team = team
    await SessionRepository.set(session)
    await this.loadSessionTeam()
    Router.push('/team')
  }

  async goTo (path) {
    try {
      await Router.push(path)
    } catch (error) {
      window.location.href = path
    }
  }

  render () {
    const team = this.state.team

    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand href='/team'>Switchboard ☎️</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            {
              team.id
                ? <HighlightableNavigationLink href='/team'>{team.name} Dashboard</HighlightableNavigationLink>
                : null
            }
            {
              team.id
                ? <HighlightableNavigationLink href='/team/members'>Team Members</HighlightableNavigationLink>
                : null
            }
          </Nav>
          <Nav className='justify-content-end'>
            <NavDropdown title='Teams' id='nav-dropdown'>
              {
                this.state.teams.map(team => {
                  return <NavDropdown.Item key={`team-${team.id}`} onClick={() => this.setTeam(team)}>{team.name}</NavDropdown.Item>
                })
              }
            </NavDropdown>
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

export default NavbarLoggedIn
