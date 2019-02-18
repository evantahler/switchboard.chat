import React, { Component } from 'react'
import LoggedOutLayout from './../layouts/loggedOut.js'
import { Text, Card, CardItem, Left, Thumbnail, Body } from 'native-base'

const IconImage = require('./../../assets/images/phone.png')

export default class Welcome extends Component {
  render () {
    return (
      <LoggedOutLayout>
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={IconImage} />
              <Body>
                <Text>Switchbboard</Text>
                <Text note>Sign In</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
      </LoggedOutLayout>
    )
  }
}
