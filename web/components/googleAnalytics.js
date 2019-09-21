import React from 'react'
import Head from 'next/head'
import Router from 'next/router'

const GoogleAnalyticsTrackingID = 'UA-71483239-1'

class Loader extends React.Component {
  constructor () {
    super()
    this.state = { initiallyTracked: false }
  }

  async componentDidMount () {
    const { initiallyTracked } = this.state
    if (!initiallyTracked) {
      this.trackPage()
      await this.setState({ initiallyTracked: true })
    }

    Router.events.on('routeChangeComplete', this.trackPage)
  }

  componentWillUnmount () {
    Router.events.off('routeChangeComplete', this.trackPage)
  }

  trackPage () {
    if (!window) { return }

    window.dataLayer = window.dataLayer || []
    function gtag () { window.dataLayer.push(arguments) }
    gtag('js', new Date())

    gtag('config', GoogleAnalyticsTrackingID)
  }

  render () {
    return (
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GoogleAnalyticsTrackingID}`} />
      </Head>
    )
  }
}

export default Loader
