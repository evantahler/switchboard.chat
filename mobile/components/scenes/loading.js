import React, { Component } from 'react'
import { ImageBackground, Dimensions, ActivityIndicator } from 'react-native'
import { Container } from 'native-base'
import SessionRepository from './../../../web/repositories/session'

const BackgroundImage = require('./../../assets/images/old-phone.jpg')
const { height, width } = Dimensions.get('window')
const ImageStyle = { flex: 1, height: height, width: width, resizeMode: 'cover' }

const loadingDelay = 1000

export default class LoggedOut extends Component {
  componentDidMount () {
    setTimeout(() => { this.load() }, loadingDelay)
  }

  async load () {
    const { localStorage } = global
    const { navigation } = this.props

    try {
      const sessionResponse = await localStorage.getItem(SessionRepository.key)

      if (sessionResponse) {
        navigation.navigate('LoggedInNavigationStack')
      } else {
        navigation.navigate('LoggedOutNavigationStack')
      }
    } catch (error) {
      navigation.navigate('LoggedOutNavigationStack')
    }
  }

  render () {
    return (
      <Container>
        <ImageBackground
          source={BackgroundImage}
          style={ImageStyle}
        >
          <ActivityIndicator size='large' color='#050505' style={{ flexGrow: 1 }} />
        </ImageBackground>
      </Container>
    )
  }
}
