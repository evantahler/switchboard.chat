import { Card } from 'react-bootstrap'

const WhatIsSwitchboard = () => {
  return (
    <Card border='info'>
      <Card.Body>
        <Card.Text>Switchboard is a hosted web application which enables teams to communicate with thier customers, partners, and remote employees via text-message.  Communicating via text-message (or SMS) is certainly convienet, but it locks all of your essetnail communication to a single phone which can be out of power, lost, or even stolen. Using a shared, hosted text-message phone number from Setichboard will enable:</Card.Text>
        <ul>
          <li>Your whole team to share a single phone number, and without needing to access a physical phone</li>
          <li>A shared log of all communications both in and out of the shared number</li>
          <li>Multiple accounts so you can add and remove team members as your team grows</li>
          <li>The ability to add internal notes and comments to the converstation, just for your team</li>
          <li>Customizable notifications for unread messages</li>
        </ul>
      </Card.Body>
    </Card>
  )
}

export default WhatIsSwitchboard
