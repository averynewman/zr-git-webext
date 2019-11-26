import React from 'react'
import { connect } from 'react-redux'
import { startFetch } from '../action-creators/fetch-commit'
import { branchDefault } from '../../constants'

class FetchButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleFetch = this.handleFetch.bind(this)
  }

  handleFetch () {
    this.props.startFetch()
  }

  render () {
    if (this.props.currentBranch === branchDefault) {
      return (
        null
      )
    }
    return (
      <div>
        <button className='change-repo' onClick={this.handleFetch}>
          Fetch and replace
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({ currentBranch: state.branches.currentBranch }),
  { startFetch }
)(FetchButton)
