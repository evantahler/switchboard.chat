import React, { Component } from 'react'
import { Icon } from 'native-base'

export default class SignOut extends Component {
  static navigationOptions () {
    return {
      drawerLabel: 'Teams',
      drawerIcon: <Icon name='home' />
    }
  }

  async componentDidMount () {
    const { navigation } = this.props
    // const routeParent = navigation.dangerouslyGetParent().dangerouslyGetParent()
    // console.log(routeParent)
    // routeParent.navigate('TeamsDrawer')
    // routeParent.getChildNavigation('TeamsDrawer').navigate('Teams')
    // navigation.dispatch({ type: 'Navigation/BACK' })
    navigation.dispatch({
      type: 'Navigation/NAVIGATE',
      routeName: 'TeamsDrawer',
      action: {
        type: 'Navigation/NAVIGATE',
        routeName: 'Teams'
      }
    })
  }

  render () {
    return null
  }
}
