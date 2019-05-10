import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RepoSelect from './repo-select'
import * as repoActionCreator from '../action-creators/repo-select'

const Popup = ({ cloning, repoUrl, validRepo, repoActions }) => {
  const changeRepo = () => {
    repoActions.changeRepo()
  }

  return (
    <div className='popup'>
      <h1>zr-git-webext dev version</h1>
      <p>{
        ((cloning, repoUrl, validRepo) => {
          if (cloning === true) {
            return 'Cloning new repo...'
          } else if (validRepo === false) {
            return 'Clone failed. Check your path and try again.'
          } else if (repoUrl === 'https://github.com') {
            return 'No repo selected yet.'
          } else {
            return ('Active repo: ' + repoUrl)
          }
        })(cloning, repoUrl, validRepo)
      }</p>
      <RepoSelect repoChange={changeRepo} />
    </div>
  )
}

Popup.propTypes = {
  repoUrl: PropTypes.string,
  repoActions: PropTypes.object
}

Popup.defaultProps = {
  repoUrl: 'https://github.com',
  repoActions: {}
}

// `connect` is a react-redux thing that ties redux state
// to react component properties
export default connect(
  state => ({
    repoUrl: state.repoSelect.repoUrl,
    validRepo: state.repoSelect.validRepo,
    cloning: state.repoSelect.cloning
  }),
  dispatch => ({ repoActions: bindActionCreators(repoActionCreator, dispatch) })
)(Popup)
