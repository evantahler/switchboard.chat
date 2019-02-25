import React, { Component } from 'react'
import LoggedOutLayout from './../layouts/loggedOut.js'
import { Text, Card, CardItem, Left, Thumbnail, Body } from 'native-base'
import VersionRepository from './../../../web/repositories/version'
import IconImage from './../../assets/images/phone.png'

export default class Welcome extends Component {
  constructor () {
    super()
    this.state = {
      version: {},
      endpoint: process.env.API_URL
    }
  }

  async componentDidMount () {
    const version = await VersionRepository.get()
    if (version) { this.setState({ version }) }
  }

  render () {
    const { version, endpoint } = this.state

    return (
      <LoggedOutLayout>
        <Card>
          <CardItem header>
            <Left>
              <Thumbnail source={IconImage} />
              <Body>
                <Text>Switchbboard</Text>
                <Text note>Centralized SMS Communication for Teams</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Text style={{ fontSize: 10, color: 'gray' }}>
              Current Version: {version.version}{'\n'}
              Connecting to: {endpoint}</Text>
          </CardItem>
        </Card>
      </LoggedOutLayout>
    )
  }
}
