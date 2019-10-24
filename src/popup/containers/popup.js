import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RepoSelect from './repo-select'
import BranchSelect from './branch-select'
import FetchButton from './fetch-button'

class Popup extends React.Component {
  render () {
    return (
      <div className='popup'>
        <h1>zr-git-webext dev version</h1>
        <RepoSelect />
        <BranchSelect />
        <FetchButton />
      </div>
    )
  }
}

/* Popup.propTypes = {
  repoUrl: PropTypes.string
}

Popup.defaultProps = {
  repoUrl: 'error loading repoUrl from stateToProps'
} */

export default connect(
  null
)(Popup)
