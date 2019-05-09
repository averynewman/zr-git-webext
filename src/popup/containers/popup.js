import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RepoSelect from './repo-select'
import * as repoActionCreator from '../action-creators/repo-select'

const Popup = ({ repoUrl, repoActions }) => {
  const changeRepo = () => {
    repoActions.changeRepo()
  }

  return (
    <div className='popup'>
      <h1>zr-git-webext dev version</h1>
      <p>{repoUrl}</p>
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
  state => ({ repoUrl: state.repoUrl }),
  dispatch => ({ repoActions: bindActionCreators(repoActionCreator, dispatch) })
)(Popup)
