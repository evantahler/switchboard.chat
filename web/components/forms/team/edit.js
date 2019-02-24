import React from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import TeamRepository from './../../../repositories/team'
import TeamsRepository from './../../../repositories/teams'
import StripeFormContainer from './../stripe/stripeFormContainer'

class NewTeamForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      stripeToken: null,
      team: {
        name: '',
        areaCode: '',
        phoneNumber: '',
        billingEmail: '',
        voiceResponse: ''
      },
      card: {}
    }
  }

  async componentDidMount () {
    const teamResponse = await TeamRepository.get()
    if (teamResponse) { this.setState({ team: teamResponse.team }) }
    const billingInformation = await TeamRepository.loadBillingInformation()
    if (billingInformation) { this.setState({ card: billingInformation.card }) }
  }

  setStripeToken (stripeResponse) {
    this.setState({ stripeToken: stripeResponse.id })
  }

  validate (event) {
    const form = event.currentTarget
    const valid = form.checkValidity()
    event.preventDefault()
    event.stopPropagation()
    this.setState({ validated: true })
    if (valid) { this.submit(form) }
  }

  async submit (form) {
    const data = FormSerializer(form)
    if (this.state.stripeToken) { data.stripeToken = this.state.stripeToken }
    const { team } = await TeamRepository.update(data)
    await TeamRepository.hydrate()
    await TeamsRepository.hydrate()
    this.setState({ team })
  }

  render () {
    const { validated, team, card } = this.state

    const update = async (event) => {
      team[event.target.id] = event.target.value
      this.setState({ team })
    }

    return (
      <div>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Card on File: {card.brand}, xxxx-{card.last4}</Card.Title>
                <Card.Text>
                  Billing Zip Code: {card.address_zip}<br />
                  Expiry: {card.exp_month}/{card.exp_year}<br />
                  <hr />
                  Price per Month: ${team.pricePerMonth / 100}<br />
                  Messages Included: {team.includedMessagesPerMonth}<br />
                Price per additional Message: ${team.pricePerMessage / 100}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Body>
                <p>Add new Card</p>
                <StripeFormContainer setStripeToken={this.setStripeToken.bind(this)} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <br />

        <Form
          id='form'
          onSubmit={event => this.validate(event)}
          validated={validated}
          noValidate
        >
          <Form.Group controlId='name'>
            <Form.Label>Team Name</Form.Label>
            <Form.Control autoFocus value={team.name} required type='text' placeholder='My Team' onChange={e => update(e)} />
            <Form.Control.Feedback type='invalid'>Name is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='phoneNumber'>
            <Form.Label>Team Phone Number</Form.Label>
            <Form.Text className='text-muted'>If you want to change your team's phone number, please contact support.</Form.Text>
            <Form.Control disabled value={team.phoneNumber} required type='text' />
          </Form.Group>

          <Form.Group controlId='voiceResponse'>
            <Form.Label>Voice Response</Form.Label>
            <Form.Control value={team.voiceResponse} required type='text' placeholder='Send a text...' onChange={e => update(e)} />
            <Form.Text className='text-muted'>This message will be read to someone who calls your team phone number.</Form.Text>
            <Form.Control.Feedback type='invalid'>A Voice Response s is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='billingEmail'>
            <Form.Label>Billing Email Adress</Form.Label>
            <Form.Control value={team.billingEmail} required type='email' placeholder='you@example.com' onChange={e => update(e)} />
            <Form.Control.Feedback type='invalid'>A billing Email Adress is required</Form.Control.Feedback>
          </Form.Group>

          <Button variant='primary' type='submit'>Submit</Button>
        </Form>
      </div>
    )
  }
}

export default NewTeamForm
