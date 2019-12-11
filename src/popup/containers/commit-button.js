import React from 'react'
import { connect } from 'react-redux'
import { startCommit } from '../action-creators/fetch-commit'
import { branchDefault } from '../../constants'

class CommitButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleCommit = this.handleCommit.bind(this)
  }

  handleCommit () {
    this.props.startCommit({ message: 'test commit message' })
  }

  render () {
    if (this.props.currentBranch === branchDefault) {
      return (
        null
      )
    }
    return (
      <div>
        <button className='commit-push' onClick={this.handleCommit}>
          Commit and push
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({ currentBranch: state.branches.currentBranch }),
  { startCommit }
)(CommitButton)
