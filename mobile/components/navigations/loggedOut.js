import { Component } from 'react'
import { Linking } from 'react-native'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'

import Welcome from './../scenes/welcome'
import SignIn from './../scenes/signIn'
import SignUp from './../scenes/signUp'

class LearnMoreLink extends Component {
  openAboutPage () {
    Linking.openURL(process.env.PUBLIC_URL)
  }

  componentDidMount () {
    this.openAboutPage()
    this.props.navigation.navigate('Welcome')
  }

  render () {
    return null
  }
}

const TabNavigator = createBottomTabNavigator({
  Welcome: Welcome,
  'Sign In': SignIn,
  'Sign Up': SignUp,
  'Learn More': LearnMoreLink
})

export default createAppContainer(TabNavigator)
