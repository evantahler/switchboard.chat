import React from 'react'
import { Spinner } from 'react-bootstrap'

class Loader extends React.Component {
  render () {
    return (
      <>
        <Spinner animation='grow' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </>
    )
  }
}

export default Loader
