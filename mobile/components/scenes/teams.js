import React, { Component } from 'react'
import Layout from './../layouts/layout.js'
import { Text, Card, CardItem, Left, Thumbnail, Body } from 'native-base'
import IconImage from './../../assets/images/phone.png'

export default class Welcome extends Component {
  render () {
    return (
      <Layout>
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={IconImage} />
              <Body>
                <Text>Switchbboard</Text>
                <Text note>Teams</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
      </Layout>
    )
  }
}
