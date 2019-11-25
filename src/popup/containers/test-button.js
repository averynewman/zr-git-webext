import React from 'react'
import { connect } from 'react-redux'
import { testButton } from '../action-creators/fetch-commit'
import { branchDefault } from '../../constants'

class TestButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleFetch = this.handleFetch.bind(this)
  }

  handleClick () {
    this.props.testButton()
  }

  render () {
    if (this.props.currentBranch === branchDefault) {
      return (
        null
      )
    }
    return (
      <div>
        <button className='test-button' onClick={this.handleClick}>
          Test grab
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({ currentBranch: state.branches.currentBranch }),
  { testButton }
)(TestButton)