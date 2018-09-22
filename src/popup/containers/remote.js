/* global browser */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as countActionCreator from '../action-creators/counter'

const Popup = ({ counter, countActions }) => {
 const increaseCounter = () => {
    countActions.increase()
  }

  return (
    <div className='popup'>
      <h1>{browser.i18n.getMessage('popupTitle')}</h1>
      <button onClick={increaseCounter}>Click to increase the counter</button>: { counter }<br />
      <button onClick={openGithub}>
        Click to see more about <code>react-webextension-boilerplate</code>
      </button>
    </div>
  )
}

Popup.propTypes = {
  counter: PropTypes.number,
  countActions: PropTypes.object
}

Popup.defaultProps = {
  counter: -1,
  countActions: {}
}

// `connect` is a react-redux thing that ties redux state
// to react component properties
export default connect(
  state => ({ counter: state.counter }),
  dispatch => ({ countActions: bindActionCreators(countActionCreator, dispatch) })
)(Popup)
