import { Component } from 'react'
import { Linking } from 'react-native'

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

export default LearnMoreLink
