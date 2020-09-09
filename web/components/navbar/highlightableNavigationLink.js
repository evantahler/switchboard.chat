import React from 'react'
import Router from 'next/router'
import { Nav } from 'react-bootstrap'

class HighlightableNavigationLink extends React.Component {
  constructor () {
    super()
    this.state = { hoverKey: null, activeKey: null }
  }

  componentDidMount () {
    if (!process || process.browser) {
      this.setState({ activeKey: Router.pathname })
    }
  }

  onMouseEnter (matchKey) {
    this.setState({ hoverKey: matchKey })
  }

  onMouseLeave () {
    this.setState({ hoverKey: null })
  }

  linkStyle (matchKey) {
    let color = null

    if (
      (this.state.activeKey && this.state.activeKey === matchKey) ||
      (this.state.hoverKey && this.state.hoverKey === matchKey)
    ) {
      color = 'rgba(75, 191, 115, 0.965)'
    }

    return { color }
  }

  async goTo (path) {
    try {
      await Router.push(path)
    } catch (error) {
      window.location.href = path
    }
  }

  render () {
    const href = this.props.href

    return (
      <Nav.Link
        onClick={this.goTo.bind(this, href)}
        onMouseEnter={() => { this.onMouseEnter(href) }}
        onMouseLeave={() => { this.onMouseLeave() }}
        style={this.linkStyle(href)}
      >
        {this.props.children}
      </Nav.Link>
    )
  }
}

export default HighlightableNavigationLink
