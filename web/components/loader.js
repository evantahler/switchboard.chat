import React from 'react'
import { Spinner } from 'react-bootstrap'

class Loader extends React.Component {
  constructor () {
    super()
    this.state = { loading: true }
  }

  render () {
    if (!this.state.loading) { return null }
    return <Spinner annimation='grow' />
  }
}

export default Loader
