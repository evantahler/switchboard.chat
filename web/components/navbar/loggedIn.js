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
import FolderRepository from './../../repositories/folder'
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
    await FolderRepository.remove()
    await TeamMemberRepository.remove()
    await TeamMembersRepository.remove()

    let session = await SessionRepository.get()
    session.team = team
    await SessionRepository.set(session)
    await this.loadSessionTeam()
    Router.push('/team/stream')
    window.location.reload() // TODO how to tell the parent to re-render?
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
      <Navbar bg='light' variant='light' expand='lg'>
        <Navbar.Brand href='/team/stream'>Switchboard ☎️</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            {
              team.id
                ? <>
                  <HighlightableNavigationLink href='/team/stream'>Stream</HighlightableNavigationLink>
                  <HighlightableNavigationLink href='/team/contacts'>Contacts</HighlightableNavigationLink>
                  </>
                : null
            }
            {
              team.id
                ? <NavDropdown title={`${team.name} Settings`} id='team-dropdown'>
                  <NavDropdown.Item onClick={() => this.goTo('/team/folders')}>Folders</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => this.goTo('/team/members')}>Members</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => this.goTo('/team/edit')}>Settings</NavDropdown.Item>
                </NavDropdown>
                : null
            }
          </Nav>
          <Nav className='justify-content-end'>
            <NavDropdown title='Teams' id='teams-dropdown'>
              {
                this.state.teams.map(team => {
                  return <NavDropdown.Item key={`team-${team.id}`} onClick={() => this.setTeam(team)}>{team.name}</NavDropdown.Item>
                })
              }
            </NavDropdown>
            <NavDropdown title='Settings' id='user-dropdown' className='mr-right'>
              <NavDropdown.Item onClick={() => this.goTo('/user/profile')}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.goTo('/user/notifications')}>Notifications</NavDropdown.Item>
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
