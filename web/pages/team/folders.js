import React from 'react'
import Layout from './../../components/layouts/loggedIn.js'
import TeamRepository from './../../repositories/team.js'
import AddFoldertModal from './../../components/modals/folder/add'
import FoldersList from './../../components/lists/folders.js'

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
      <Layout>
        <h1>{team.name} Folders</h1>
        <AddFoldertModal />
        <br />
        <br />
        <FoldersList />
      </Layout>
    )
  }
}

export default Page
