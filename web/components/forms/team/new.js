import React from 'react'
import Router from 'next/router'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Loader from './../../loader'
import FormSerializer from './../utils/formSerializer'
import TeamRepository from './../../../repositories/team'
import TeamsRepository from './../../../repositories/teams'
import UserRepository from './../../../repositories/user'
import SessionRepository from './../../../repositories/session'
import AreaCodes from './../../../utils/areacodes'
import StripeFormContainer from './../stripe/stripeFormContainer'

const areaCodeUtil = new AreaCodes()

class NewTeamForm extends React.Component {
  constructor () {
    super()
    this.state = {
      submitable: false,
      submitting: false,
      validated: false,
      stripeToken: null,
      areaCodes: [],
      team: {
        name: '',
        areaCode: '',
        phoneNumber: '',
        billingEmail: ''
      },
      phoneNumbers: []
    }
  }

  async componentDidMount () {
    const user = await UserRepository.get()
    const team = this.state.team
    team.billingEmail = user.user.email
    const areaCodes = await areaCodeUtil.get()
    this.setState({ areaCodes, team })
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
    this.setState({ submitting: true })
    const data = FormSerializer(form)
    data.stripeToken = this.state.stripeToken
    const { team, error } = await TeamRepository.create(data)
    if (team && !error) {
      const session = await SessionRepository.get(data)
      session.team = team
      await SessionRepository.set(session)
      await TeamsRepository.hydrate()
      await Router.push('/team/stream')
    } else {
      this.setState({ submitting: false })
    }
  }

  async loadPhoneNumbers () {
    const team = this.state.team
    team.phoneNumber = ''
    await this.setState({ team, phoneNumbers: [] })
    const areaCode = this.state.team.areaCode
    const { phoneNumbers, error } = await TeamRepository.loadPhoneNumbers(areaCode)
    if (!error) { this.setState({ phoneNumbers }) }
  }

  render () {
    const { validated, team, phoneNumbers, areaCodes, stripeToken, submitting } = this.state

    const update = async (event) => {
      const previousAreaCode = team.areaCode
      team[event.target.id] = event.target.value
      if (team.areaCode && (!team.phoneNumber || previousAreaCode !== team.areaCode)) {
        this.loadPhoneNumbers()
      }
      this.setState({ team })
    }

    const submitable = (team.name && team.phoneNumber && stripeToken) && !submitting

    return (
      <div>
        <StripeFormContainer setStripeToken={this.setStripeToken.bind(this)} />

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

          <Form.Group controlId='billingEmail'>
            <Form.Label>Billing Email Adress</Form.Label>
            <Form.Control autoFocus value={team.billingEmail} required type='email' placeholder='you@example.com' onChange={e => update(e)} />
            <Form.Control.Feedback type='invalid'>A billing Email Adress is required</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group controlId='areaCode'>
                <Form.Label>Area Code</Form.Label>
                <Form.Control value={team.areaCode} required as='select' onChange={e => update(e)}>
                  <option disabled default value=''>Choose a US area code</option>
                  {areaCodes.map(areaCode => { return <option key={`areaCode-${areaCode}`}>{areaCode}</option> })}
                </Form.Control>
                <Form.Text className='text-muted'>The area code you would like your team phone number to use.  Choose an Area Code to see availalbe phone numbers.</Form.Text>
                <Form.Control.Feedback type='invalid'>Area Code is required</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={8}>
              {
                team.areaCode && phoneNumbers.length > 0
                  ? <Form.Group controlId='phoneNumber'>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control value={team.phoneNumber} required as='select' onChange={e => update(e)}>
                      <option disabled default value=''>Choose a phone number</option>
                      {phoneNumbers.map(phoneNumber => {
                        return (
                          <option key={`phoneNumber-${phoneNumber.phoneNumber}`} value={phoneNumber.phoneNumber}>
                            {phoneNumber.friendlyName}, {phoneNumber.locality}, {phoneNumber.region}
                          </option>
                        )
                      })}
                    </Form.Control>
                    <Form.Text className='text-muted'>Your team's phone number.</Form.Text>
                    <Form.Control.Feedback type='invalid'>Phone Number is required</Form.Control.Feedback>
                  </Form.Group>
                  : team.areaCode && phoneNumbers.length === 0
                    ? <div align='center'><br /><Loader /></div>
                    : <div align='center'><br /><br />...</div>
              }
            </Col>
          </Row>

          <Button disabled={!submitable} variant='primary' type='submit'>Submit</Button>
        </Form>
      </div>
    )
  }
}

export default NewTeamForm
