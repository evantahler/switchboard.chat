import { Card } from 'react-bootstrap'

const WhatIsSwitchboard = () => {
  return (
    <Card border='info'>
      <Card.Body>
        <Card.Text>Switchboard is a  web application which enables teams to communicate with their customers, partners, students, and  employees via text-message. Communicating via text-message (or SMS) is certainly convenient, but it locks all of your essential communication to a single phone which can be out of power, lost, or even stolen. Using a shared, hosted text-message phone number from Switchboard will enable the following features:</Card.Text>
        <ul>
          <li>Your whole team can share a single phone number  without needing to physical access to the phone</li>
          <li>A shared log of all communications both in and out of your phone  number</li>
          <li>Multiple accounts so you can add and remove team members as your team grows</li>
          <li>The ability to add internal notes and comments to the conversation, just for your team.  Share internatl updates and status along with the text messages.</li>
          <li>Customizable notifications for unread messages so you never miss a thing!</li>
        </ul>
      </Card.Body>
    </Card>
  )
}

export default WhatIsSwitchboard
