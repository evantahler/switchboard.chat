import React from 'react'
// import { Container, Row, Col } from 'react-bootstrap'

class PageLoggedOut extends React.Component {
  constructor () {
    super()
    this.state = { date: new Date() }
  }

  copyright () {
    return String.fromCharCode(169) + ' ' + this.state.date.getFullYear()
  }

  render () {
    return (
      <footer>
        <p>{ this.copyright() } <a target='_blank' href='https://www.delicioushat.com'>Delicious Hat</a></p>
      </footer>
    )
  }
}

export default PageLoggedOut
