import { Row, Col, Tab, ListGroup } from 'react-bootstrap'

const FeaturesTable = () => {
  return (
    <div>
      <Tab.Container defaultActiveKey='#feature1'>
        <Row>
          <Col sm={4}>
            <ListGroup>
              <ListGroup.Item action href='#feature1'>
                <strong>Threaded Messages</strong>
              </ListGroup.Item>
              <ListGroup.Item action href='#feature2'>
                <strong>Missed-Message Notifications</strong>
              </ListGroup.Item>
              <ListGroup.Item action href='#feature3'>
                <strong>Internal Notes</strong>
              </ListGroup.Item>
              <ListGroup.Item action href='#feature4'>
                <strong>Tasks from Messages</strong>
              </ListGroup.Item>
              <ListGroup.Item action href='#feature5'>
                <strong>Attachments</strong>
              </ListGroup.Item>
              <ListGroup.Item action href='#feature6'>
                <strong>Website and iOS app</strong>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey='#feature1'>
                <p>See all of your team's messages aggregated in one place! Everyone on the team can see all communications as they happen; in real time!  Keep a record of all incoming and outgoing messages exchanged with each employee.</p>
              </Tab.Pane>
              <Tab.Pane eventKey='#feature2'>
                <p>Optionally configure notifications so that you will never miss a message. You can be notified via SMS or email if too much time has elapsed since your team received a message. You have the ability to set up different notification rules for each team member to create a simple priority tree.</p>
              </Tab.Pane>
              <Tab.Pane eventKey='#feature3'>
                <p>Need to communicate with other team members?  Leave in-thead messages to coordinate in one place.</p>
              </Tab.Pane>
              <Tab.Pane eventKey='#feature4'>
                <p>Improve your customer service by keeping TODO items alongside your customer communications.  Assign them to your team members and keep track of what is getting done.</p>
              </Tab.Pane>
              <Tab.Pane eventKey='#feature5'>
                <p>Store both incomming and outgoing message attachments, images, and videos... all included with Switchboard's standard pricing</p>
              </Tab.Pane>
              <Tab.Pane eventKey='#feature6'>
                <p>The Switchboard website and companion iOS app (coming soon) are here to help you at work, and on the go!</p>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}

export default FeaturesTable
