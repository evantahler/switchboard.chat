import { Table } from 'react-bootstrap'

const FeaturesTable = () => {
  return (
    <Table>
      <tbody>
        <tr>
          <td><strong>Threaded Messages</strong></td>
          <td>See all of your team's messages aggregated in one place! Everyone on the team can see all communications as they happen; in real time!  Keep a record of all incoming and outgoing messages exchanged with each employee.</td>
        </tr>
        <tr>
          <td><strong>Missed-Message Notifications</strong></td>
          <td>Optionally configure notifications so that you will never miss a message. You can be notified via SMS or email if too much time has elapsed since your team received a message. You have the ability to set up different notification rules for each team member to create a simple priority tree.</td>
        </tr>
        <tr>
          <td><strong>Internal Notes</strong></td>
          <td>Need to communicate with other team members?  Leave in-thead messages to coordinate in one place.</td>
        </tr>
        <tr>
          <td><strong>Tasks from Messages</strong></td>
          <td>Improve your customer service by keeping TODO items alongside your customer communications.  Assign them to your team members and keep track of what is getting done.</td>
        </tr>
        <tr>
          <td><strong>Attachments</strong></td>
          <td>Store both incomming and outgoing message attachments and images, all included with Switchboard's standard pricing</td>
        </tr>
        <tr>
          <td><strong>Website and iOS app</strong></td>
          <td>The Switchboard website and companion app are here to help you at work, and on the go!</td>
        </tr>
      </tbody>
    </Table>
  )
}

export default FeaturesTable
