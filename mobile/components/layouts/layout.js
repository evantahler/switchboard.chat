import React, { Component } from 'react'
import { ImageBackground, Dimensions } from 'react-native'
import { Container, Header, Title, Content, Left, Right, Body } from 'native-base'

const BackgroundImage = require('./../../assets/images/old-phone.jpg')
const { height, width } = Dimensions.get('window')
const ImageStyle = { flex: 1, height: height, width: width, resizeMode: 'cover' }

export default class LoggedOut extends Component {
  render () {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Switchboard</Title>
          </Body>
          <Right />
        </Header>

        <ImageBackground
          source={BackgroundImage}
          style={ImageStyle}
        >
          <Content>
            { this.props.children }
          </Content>
        </ImageBackground>
      </Container>
    )
  }
}
