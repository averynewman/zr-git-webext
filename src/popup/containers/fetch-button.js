import React from 'react'
import { connect } from 'react-redux'
import { startFetch } from '../action-creators/fetch-commit'

class RepoSelect extends React.Component {
  constructor (props) {
    super(props)
    this.handleFetch = this.handleFetch.bind(this)
  }

  handleFetch () {
    this.props.startFetch()
  }

  render () {
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
  null,
  { startFetch }
)(RepoSelect)
