import { createSwitchNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation'

import Loading from './scenes/loading'

import Welcome from './scenes/welcome'
import SignIn from './scenes/signIn'
import SignUp from './scenes/signUp'
import LearnMore from './scenes/learnMore'

import Teams from './scenes/teams'
import SignOut from './scenes/signOut'

const LoggedOutNavigationStack = createBottomTabNavigator({
  'Welcome': Welcome,
  'Sign In': SignIn,
  'Sign Up': SignUp,
  'Learn More': LearnMore
})

const LoggedInNavigationStack = createBottomTabNavigator({
  'Teams': Teams,
  'Sign Out': SignOut
})

const MainStack = createSwitchNavigator({
  'LoggedInNavigationStack': LoggedInNavigationStack,
  'LoggedOutNavigationStack': LoggedOutNavigationStack,
  'Loading': Loading
}, {
  initialRouteName: 'Loading'
})

export default createAppContainer(MainStack)
