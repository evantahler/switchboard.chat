import { Card } from 'react-bootstrap'

const WhatIsSwitchboard = () => {
  return (
    <Card border='info'>
      <Card.Body>
        <Card.Title>What is Switchboard?</Card.Title>
        <Card.Text>Switchboard.chat is a hosted web application which enables teams to communicate with thier remote employees via SMS. Using a shared, hosted SMS number enables:</Card.Text>
        <ul>
          <li>Many people to share a single phone number (and without needing to access a physical phone)</li>
          <li>A mobile-friendly website your team can access whenever they need</li>
          <li>A shared log of all communications both in and out of the shared number</li>
          <li>Multiple accounts so you can add and remove team members as your team grows</li>
          <li>Customizable notifications for unread messages</li>
        </ul>
      </Card.Body>
    </Card>
  )
}

export default WhatIsSwitchboard
