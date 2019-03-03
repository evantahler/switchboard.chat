import { Component } from 'react'

export default class Welcome extends Component {
  async componentDidMount () {
    await this.clearLocalStorage()
    const { __reloadApp } = global
    __reloadApp()
  }

  async clearLocalStorage () {
    const { localStorage } = global
    await localStorage.clear()
  }

  render () {
    return null
  }
}
