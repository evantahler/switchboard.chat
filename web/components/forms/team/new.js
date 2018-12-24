import React from 'react'
import Router from 'next/router'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Loader from './../../loader'
import FormSerializer from './../utils/formSerializer'
import TeamRepository from './../../../repositories/team'
import SessionRepository from './../../../repositories/session'
import AreaCodes from './../../../utils/areacodes'

const areaCodeUtil = new AreaCodes()

class NewTeamForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      areaCodes: [],
      team: {
        name: '',
        areaCode: '',
        phoneNumber: ''
      },
      phoneNumbers: []
    }
  }

  async componentDidMount () {
    const areaCodes = await areaCodeUtil.get()
    this.setState({ areaCodes })
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
    const { team, error } = await TeamRepository.create(data)
    if (team && !error) {
      const session = await SessionRepository.get(data)
      session.team = team
      await SessionRepository.set(session)
      Router.push('/team')
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
    const { validated, team, phoneNumbers, areaCodes } = this.state

    const update = async (event) => {
      team[event.target.id] = event.target.value
      const previousAreaCode = team.areaCode
      if (team.areaCode && (!team.phoneNumber || previousAreaCode !== team.areaCode)) {
        this.loadPhoneNumbers()
      }
      this.setState({ team })
    }

    return (
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

        <Row>
          <Col md={4}>
            <Form.Group controlId='areaCode'>
              <Form.Label>Area Code</Form.Label>
              <Form.Control value={team.areaCode} required as='select' onChange={e => update(e)}>
                <option disabled default value=''>Choose a US area code</option>
                { areaCodes.map(areaCode => { return <option key={`areaCode-${areaCode}`}>{areaCode}</option> }) }
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
                    { phoneNumbers.map(phoneNumber => {
                      return <option key={`phoneNumber-${phoneNumber.phoneNumber}`} value={phoneNumber.phoneNumber}>
                        {phoneNumber.friendlyName}, {phoneNumber.locality}, {phoneNumber.region}
                      </option>
                    })}
                  </Form.Control>
                  <Form.Text className='text-muted'>Your team's phone number.</Form.Text>
                  <Form.Control.Feedback type='invalid'>Phone Number is required</Form.Control.Feedback>
                </Form.Group>
                : team.areaCode && phoneNumbers.length === 0
                  ? <div align='center'><br /><Loader /></div>
                  : null
            }
          </Col>
        </Row>

        {
          team.phoneNumber
            ? <Button variant='primary' type='submit'>Submit</Button>
            : null
        }
      </Form>
    )
  }
}

export default NewTeamForm
