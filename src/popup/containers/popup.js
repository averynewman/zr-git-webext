import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Status from './status'
import RepoSelect from './repo-select'
import BranchSelect from './branch-select'
import FetchButton from './fetch-button'
import Authentication from './authentication'
import CommitButton from './commit-button'
// import Merge from './merge'

class Popup extends React.Component {
  render () {
    if (this.props.merging) {
      return (
        <div className='popup'>
          <h1>zr-git-webext dev version</h1>
          <div>Merge in progress. Please resolve all conflicts and commit, or abort if you do not wish to proceed.</div>
        </div>
      )
    } else {
      return (
        <div className='popup'>
          <h1>zr-git-webext dev version</h1>
          <Status />
          <RepoSelect />
          <BranchSelect />
          <FetchButton />
          <CommitButton />
          <Authentication />
        </div>
      )
    }
  }
}

/* Popup.propTypes = {
  repoUrl: PropTypes.string
}

Popup.defaultProps = {
  repoUrl: 'error loading repoUrl from stateToProps'
} */

export default connect(
  state => ({
    merging: state.status.merging
  })
)(Popup)
