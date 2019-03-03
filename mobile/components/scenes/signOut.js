import { Component } from 'react'

export default class Welcome extends Component {
  async componentDidMount () {
    await this.clearLocalStorage()
  }

  async clearLocalStorage () {
    const { localStorage } = global
    const { navigation } = this.props

    await localStorage.clear()
    navigation.navigate('Loading')
  }

  render () {
    return null
  }
}
