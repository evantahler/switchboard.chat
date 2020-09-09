import React from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import InjectedCheckoutForm from './checkoutForm'

class StripeFormContainer extends React.Component {
  constructor () {
    super()
    this.state = { stripe: null }
  }

  componentDidMount () {
    this.setState({ stripe: window.Stripe(process.env.STRIPE_API_PUBLISHABLE_KEY) })
  }

  render () {
    const stripe = this.state.stripe //eslint-disable-line

    return (
      <StripeProvider stripe={this.state.stripe}>
        <Elements>
          <InjectedCheckoutForm setStripeToken={this.props.setStripeToken} />
        </Elements>
      </StripeProvider>
    )
  }
}

export default StripeFormContainer
