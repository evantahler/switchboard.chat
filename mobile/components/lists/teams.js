import React, { Component } from 'react'
import { Text, Card, CardItem, Body, Button } from 'native-base'
import SessionRepository from './../../../web/repositories/session'
import TeamsRepository from './../../../web/repositories/teams'
import ContactsRepository from './../../../web/repositories/contacts'
import ContactRepository from './../../../web/repositories/contact'
import MessagesRepository from './../../../web/repositories/messages'
import MessageRepository from './../../../web/repositories/message'
import FoldersRepository from './../../../web/repositories/folders'
import TeamMemberRepository from './../../../web/repositories/teamMember'
import TeamMembersRepository from './../../../web/repositories/teamMembers'

class TeamCard extends React.Component {
  async goToTeam (team) {
    const { navigation } = this.props

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

    navigation.navigate('Stream')
  }

  render () {
    const { team } = this.props

    return (
      <Card>
        <CardItem header>
          <Text>{team.name}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text note>{team.phoneNumber}</Text>
            <Text>Total Messages In: {team.stats.messagesIn}</Text>
            <Text>Total Messages Out: {team.stats.messagesOut}</Text>
          </Body>
        </CardItem>
        <CardItem footer>
          <Button onPress={() => this.goToTeam(team)} small primary block><Text>Go to to {team.name}</Text></Button>
        </CardItem>
      </Card>
    )
  }
}

export default class TeamsList extends Component {
  constructor () {
    super()
    this.state = { teams: [] }
  }

  async componentDidMount () {
    return this.load()
  }

  async load () {
    const response = await TeamsRepository.get()
    if (response) { this.setState({ teams: response.teams }) }
  }

  render () {
    const { teams } = this.state
    const { navigation } = this.props

    return (
      <>
        {
          teams.length > 0
            ? teams.map((team) => { return <TeamCard key={`team-${team.id}`} team={team} navigation={navigation} /> })
            : <Text variant='warning'>You are not yet a member of any teams.  You can create a new team.</Text>
        }
      </>
    )
  }
}
