import React, { Component } from 'react'
import { Keyboard } from 'react-native'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import SessionRepository from './../../../../web/repositories/session'
import UserRepository from './../../../../web/repositories/user'
import * as Validator from 'validator'

export default class Welcome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {
        email: false,
        password: false
      }
    }
  }

  async validate () {
    await Keyboard.dismiss()

    const { email, password } = this.state
    let errors = {}

    if (!Validator.isEmail(email)) {
      errors.email = true
    }

    if (!Validator.isLength(password, { min: 6 })) {
      errors.password = true
    }

    this.setState({ errors })
    const invalid = Object.keys(errors).length > 0
    if (!invalid) { this.submit() }
  }

  async submit () {
    const { email, password } = this.state
    const { navigation } = this.props

    const sessionData = await SessionRepository.create({ email, password })
    if (!sessionData) { return }
    await UserRepository.get(sessionData)
    navigation.navigate('Loading')
  }

  render () {
    const { style } = this.props
    const { email, password, errors } = this.state

    return (
      <>
        <Form style={style}>
          <Item floatingLabel error={errors.email}>
            <Label>Email</Label>
            <Input value={email} autoCapitalize={'none'} onChangeText={text => this.setState({ email: text })} />
          </Item>
          <Item floatingLabel last error={errors.password}>
            <Label>Password</Label>
            <Input value={password} autoCapitalize={'none'} secureTextEntry onChangeText={text => this.setState({ password: text })} />
          </Item>
          <Text />
          <Button onPress={event => this.validate(event)} success block><Text>Sign In</Text></Button>
        </Form>
      </>
    )
  }
}
