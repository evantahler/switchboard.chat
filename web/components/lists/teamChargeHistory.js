import React from 'react'
import { Table } from 'react-bootstrap'
import TeamRepository from './../../repositories/team'

class TeamChargeHistory extends React.Component {
  constructor () {
    super()
    this.state = { charges: [] }
  }

  async componentDidMount () {
    const teamResponse = await TeamRepository.get()
    if (teamResponse) { this.setState({ team: teamResponse.team }) }
    const billingInformation = await TeamRepository.loadBillingInformation()
    if (billingInformation) { this.setState({ charges: billingInformation.charges }) }
  }

  renderDateFromString (d) {
    const date = new Date(Date.parse(d))
    let paddedMonth = (date.getMonth() + 1).toString()
    if (paddedMonth.length === 1) { paddedMonth = `0${paddedMonth}` }
    return `${date.getFullYear()}/${paddedMonth}/${date.getDate()}`
  }

  render () {
    const { charges } = this.state

    return (
      <Table size='sm' striped bordered>
        <thead>
          <tr>
            <td>Charge Id</td>
            <td>Period Start</td>
            <td>Period End</td>
            <td>Total Messages</td>
            <td>Total Charge</td>
            <td>Summary</td>
          </tr>
        </thead>
        <tbody>
          {
            charges.map((charge) => {
              const descriptions = JSON.parse(charge.lineItems).map((line) => { return `$${line.value / 100} - ${line.label}` })

              return <tr key={`charge-${charge.id}`}>
                <td>{charge.id}</td>
                <td>{this.renderDateFromString(charge.billingPeriodStart)}</td>
                <td>{this.renderDateFromString(charge.billingPeriodEnd)}</td>
                <td>{charge.totalMessages}</td>
                <td>${charge.totalInCents / 100}</td>
                <td>{descriptions.map((d) => { return <span>{d}<br /></span> })}</td>
              </tr>
            })
          }
        </tbody>
      </Table>
    )
  }
}

export default TeamChargeHistory
