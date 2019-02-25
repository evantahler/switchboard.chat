import React from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { Form } from 'react-bootstrap'
import ErrorRepository from '../../../repositories/error'

class CardSection extends React.Component {
  render () {
    return (
      <Form.Group controlId='card-element'>
        <Form.Label>Card Number</Form.Label>
        <CardElement onChange={() => this.props.tryForToken()} className='form-control' />
        <Form.Control.Feedback type='invalid'>Card Number is required</Form.Control.Feedback>
      </Form.Group>
    )
  }
}

class CheckoutForm extends React.Component {
  async tryForToken (event) {
    const response = await this.props.stripe.createToken()
    if (response.error && response.error.type !== 'validation_error') {
      ErrorRepository.set(response.error.message)
      this.props.setStripeToken({ id: null })
    } else if (!response.error) {
      this.props.setStripeToken(response.token)
    } else {
      this.props.setStripeToken({ id: null })
    }
  }

  render () {
    return (
      <Form>
        <CardSection tryForToken={this.tryForToken.bind(this)} />
      </Form>
    )
  }
}

export default injectStripe(CheckoutForm)
