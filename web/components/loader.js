import React from 'react'
// import { css } from 'react-emotion'
import ScaleLoader from 'react-spinners/ScaleLoader'

class Loader extends React.Component {
  constructor () {
    super()
    this.state = { loading: true }
  }

  render () {
    return (
      <ScaleLoader
        // className={override}
        sizeUnit={'px'}
        height={35}
        width={4}
        radius={2}
        // color={'#123abc'}
        loading={this.state.loading}
      />
    )
  }
}

export default Loader
