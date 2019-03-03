import React, { Component } from 'react'
import { ImageBackground, Dimensions, ActivityIndicator } from 'react-native'
import { Container } from 'native-base'

const BackgroundImage = require('./../../assets/images/old-phone.jpg')
const { height, width } = Dimensions.get('window')
const ImageStyle = { flex: 1, height: height, width: width, resizeMode: 'cover' }

export default class LoggedOut extends Component {
  render () {
    return (
      <Container>
        <ImageBackground
          source={BackgroundImage}
          style={ImageStyle}
        >
          <ActivityIndicator size='large' color='#0000ff' style={{ flexGrow: 1 }} />
        </ImageBackground>
      </Container>
    )
  }
}
