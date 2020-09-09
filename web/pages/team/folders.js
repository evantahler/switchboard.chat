import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import TeamRepository from './../../repositories/team.js'
import AddFoldertModal from './../../components/modals/folder/add'
import FolderGrid from './../../components/forms/folder/grid.js'

class Page extends React.Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      team: {}
    }
  }

  async componentDidMount () {
    const teamResponse = await TeamRepository.get()
    if (teamResponse) { this.setState({ team: teamResponse.team }) }
  }

  render () {
    const { team } = this.state

    return (
      <Layout pageTitle='Folders'>
        <h1>{team.name} Folders</h1>
        <AddFoldertModal />
        <br />
        <br />
        <FolderGrid />
      </Layout>
    )
  }
}

export default Page
