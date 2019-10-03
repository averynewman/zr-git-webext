import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RepoSelect from './repo-select'
import BranchSelect from './branch-select'
// import * as repoActionCreator from '../action-creators/repo-select'

class Popup extends React.Component { // NEEDS FIX TO CONVERT TO OBJ NOTATION
  render () {
    return (
      <div className='popup'>
        <h1>zr-git-webext dev version</h1>
        <RepoSelect />
        <BranchSelect />
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
