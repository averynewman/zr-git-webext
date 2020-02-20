import React from 'react'
import { connect } from 'react-redux'
import { resolveMerge, abortMerge } from '../action-creators/branches'

class Merge extends React.Component {
  constructor (props) {
    super(props)
    this.handleResolve = this.handleResolve.bind(this)
    this.handleAbort = this.handleAbort.bind(this)
  }

  handleResolve () {
    this.props.resolveMerge()
  }

  handleAbort () {
    this.props.abortMerge()
  }

  render () {
    return (
      <div>
        <div>{`Merge in progress on branch ${this.props.currentBranch}. Please resolve all conflicts and commit, or abort if you do not wish to proceed.`}</div>
        <button className='resolve-merge' onClick={this.handleResolve}>
          Resolve merge and commit
        </button>
        <button className='abort-merge' onClick={this.handleAbort}>
          Abort merge
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({
    currentBranch: state.branches.currentBranch
  }),
  { resolveMerge, abortMerge }
)(Merge)
