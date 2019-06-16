import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RepoSelect from './repo-select'
// import * as repoActionCreator from '../action-creators/repo-select'

const Popup = ({ cloning, repoUrl, validRepo, erasing }) => {
  return (
    <div className='popup'>
      <h1>zr-git-webext dev version</h1>
      <p>{
        ((cloning, repoUrl, validRepo, erasing) => {
          if (erasing === true) {
            return 'Clearing filesystem...'
          } else if (cloning === true) {
            return 'Cloning new repo...'
          } else if (validRepo === false) {
            return 'Clone failed. Check your path and try again.'
          } else if (repoUrl === 'default') {
            return 'No repo selected yet.'
          } else {
            return (`Active repo: ${repoUrl}`)
          }
        })(cloning, repoUrl, validRepo, erasing)
      }</p>
      <RepoSelect />
    </div>
  )
}

Popup.propTypes = {
  repoUrl: PropTypes.string
}

Popup.defaultProps = {
  repoUrl: 'error loading repoUrl from stateToProps'
}

export default connect(
  state => ({
    repoUrl: state.repoSelect.repoUrl,
    validRepo: state.repoSelect.validRepo,
    cloning: state.repoSelect.cloning,
    erasing: state.repoSelect.erasing
  })
)(Popup)
