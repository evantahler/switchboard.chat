import React, { Component } from 'react'
import { View } from 'react-native'
import { Spinner } from 'native-base'

export default class SignOut extends Component {
  render () {
    const style = {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }

    return (
      <View style={style}>
        <Spinner color='red' />
      </View>
    )
  }
}
