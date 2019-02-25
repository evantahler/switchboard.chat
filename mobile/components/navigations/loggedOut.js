import { Component } from 'react'
import { Linking } from 'react-native'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
// import { Footer, FooterTab, Button, Text } from 'native-base'

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

// <Footer>
//   <FooterTab>
//     <Button
//       vertical
//       active={props.navigationState.index === 0}
//       onPress={() => props.navigation.navigate("LucyChat")}>
//       <Icon name="bowtie" />
//       <Text>Lucy</Text>
//     </Button>
//     <Button
//       vertical
//       active={props.navigationState.index === 1}
//       onPress={() => props.navigation.navigate("JadeChat")}>
//       <Icon name="briefcase" />
//       <Text>Nine</Text>
//     </Button>
//     <Button
//       vertical
//       active={props.navigationState.index === 2}
//       onPress={() => props.navigation.navigate("NineChat")}>
//       <Icon name="headset" />
//       <Text>Jade</Text>
//     </Button>
//   </FooterTab>
// </Footer>

// export default TabNavigator(
//   Scenes,
//   {
//     tabBarPosition: 'bottom',
//     tabBarComponent: props => {
//       return (
//         <Footer>
//           <FooterTab>
//             <Button
//               active={props.navigationState.index === 0}
//               onPress={() => props.navigation.navigate('SignIn')}
//             >
//               <Text>Sign In</Text>
//             </Button>
//             <Button
//               active={props.navigationState.index === 1}
//               onPress={() => props.navigation.navigate('SignUp')}
//             >
//               <Text>Sign Up</Text>
//             </Button>
//             <Button
//               active={props.navigationState.index === 2}
//               onPress={openAboutPage}
//             >
//               <Text>Learn More</Text>
//             </Button>
//           </FooterTab>
//         </Footer>
//       )
//     }
//   }
// )

const TabNavigator = createBottomTabNavigator({
  Welcome: Welcome,
  'Sign In': SignIn,
  'Sign Up': SignUp,
  'Learn More': LearnMoreLink
})

export default createAppContainer(TabNavigator)
