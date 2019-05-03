// import { combineReducers } from 'redux'
import { CHANGE_REPO } from '../../constants'

import repoChange from './repo-select'

const initialState = {
  repoUrl: 'https://github.com'
}

/* export default combineReducers({
  repoChange
}) */ // WRONG

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_REPO:
      return repoChange(state, action)
    default:
      console.log('default on outside reducer, oh god oh fwick uwu uwu')
      return state
  }
}
