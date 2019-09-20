import { Card } from 'react-bootstrap'

const WhatIsSwitchboard = () => {
  return (
    <Card border='info'>
      <Card.Body>
        <Card.Text><strong>Getting Started</strong></Card.Text>
        <Card.Text>When you sign up for Switchboard, you will be creating your team and the first memeber of that team...you!</Card.Text>
        <Card.Text>Each team has a single phone number used for SMS communication. You can have unlimited members of your team, and unlimited people in your address book with whom you are communicating.</Card.Text>
        <Card.Text><strong>Service Area</strong></Card.Text>
        <Card.Text>When you create your team, you can choose your phone number's area code, and choose from a slecection of available numbers. Please note that this service only works within the United States at this time 🇺🇸 .</Card.Text>
        <Card.Text><strong>Pricing</strong></Card.Text>
        <Card.Text>Registering a team costs $30/month. This covers the cost of your phone number and the first 1000 SMS messages. Every additional message sent or received will incur a fee of $0.01. The monthly fee, combined with any fees for additional messages, will be charged on the first of every month.</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default WhatIsSwitchboard
