import React, { Component } from 'react'
import { ImageBackground, Dimensions } from 'react-native'
import { Container, Header, Title, Content, Left, Right, Body, Button, Icon } from 'native-base'

const BackgroundImage = require('./../../assets/images/old-phone.jpg')
const { height, width } = Dimensions.get('window')
const ImageStyle = { flex: 1, height: height, width: width, resizeMode: 'cover' }

export default class LoggedOut extends Component {
  toggleNavigation () {
    const { navigation } = this.props
    navigation.toggleDrawer()
  }

  render () {
    const title = this.props.title || 'Switchboard'
    const showNavIcon = this.props.showNavIcon || false

    return (
      <Container>
        <Header>
          <Left>
            {
              showNavIcon
                ? <Button transparent onPress={() => { this.toggleNavigation() }}>
                  <Icon name='menu' />
                </Button>
                : null
            }
          </Left>
          <Body>
            <Title>{title}</Title>
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
