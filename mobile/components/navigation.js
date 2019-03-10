import React, { Component } from 'react'
import { createSwitchNavigator, createBottomTabNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'

import Loading from './scenes/loading'

import Welcome from './scenes/welcome'
import SignIn from './scenes/signIn'
import SignUp from './scenes/signUp'
import LearnMore from './scenes/learnMore'

import Teams from './scenes/teams'
import Stream from './scenes/team/stream'
import Contacts from './scenes/team/contacts'
import Folders from './scenes/team/folders'
import TeamMembers from './scenes/team/teamMembers'
import TeamSettings from './scenes/team/settings'
import SignOut from './scenes/signOut'

class TeamsWithReset extends React.Component {
  render () { return <Teams reset /> }
}

const TeamsDrawer = createDrawerNavigator({
  'Teams': { screen: Teams },
  'SignOut': { screen: SignOut }
})

const TeamDrawer = createDrawerNavigator({
  'Team': {
    screen: createBottomTabNavigator({
      'Stream': Stream,
      'Contacts': Contacts
    })
  },
  'Teams': { screen: TeamsWithReset },
  'SignOut': { screen: SignOut }
})

const LoggedInNavigation = createSwitchNavigator({
  'TeamsDrawer': TeamsDrawer,
  'TeamDrawer': TeamDrawer
}, {
  initialRouteName: 'TeamsDrawer'
})

const LoggedOutNavigationStack = createBottomTabNavigator({
  'Welcome': Welcome,
  'Sign In': SignIn,
  'Sign Up': SignUp,
  'Learn More': LearnMore
})

const MainStack = createSwitchNavigator({
  'LoggedInNavigation': LoggedInNavigation,
  'LoggedOutNavigationStack': LoggedOutNavigationStack,
  'Loading': Loading
}, {
  initialRouteName: 'Loading'
})

export default createAppContainer(MainStack)
