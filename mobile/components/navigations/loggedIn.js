import { createBottomTabNavigator, createAppContainer } from 'react-navigation'

import Teams from './../scenes/teams'
import SignOut from './../scenes/signOut'

const TabNavigator = createBottomTabNavigator({
  'Teams': Teams,
  'Sign Out': SignOut
})

export default createAppContainer(TabNavigator)
