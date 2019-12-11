import React from 'react'
import { connect } from 'react-redux'

class Status extends React.Component {
  render () {
    return (
      <div>{this.props.status}</div>
    )
  }
}

export default connect(
  state => ({
    status: state.status.statusMessage
  }),
  null
)(Status)
