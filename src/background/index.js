import { createStore, applyMiddleware } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import * as git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'
import thunkMiddleware from 'redux-thunk'
import 'babel-polyfill'

import { changeRepo } from './action-creators/repo-select'
import { changeBranch, updateBranchesThunk } from './action-creators/branches'
import rootReducer from './reducers'
// import EventEmitter from 'events'

const middlewares = [thunkMiddleware]

const initialState = {
  repoSelect: {
    erasing: false,
    cloning: false,
    validRepo: true,
    repoUrl: 'default'
  }
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middlewares)
)

const actions = {
  CHANGE_REPO: changeRepo,
  CHANGE_BRANCH: changeBranch,
  RELOAD_BRANCHES: updateBranchesThunk
}

/* const logStoreState = () => {
  let state = store.getState()
  Object.keys(state).forEach((key) => {
    let substate = state[key]
    Object.keys(substate).forEach((key2) => console.log(`${key2} : ${substate[key2]}`))
  }) // This is really messy but I don't trust Chrome console to show me objects correctly
} */

createBackgroundStore({ store, actions })

const recursiveObjectPrinter = (obj) => {
  let outputString = ''
  Object.keys(obj).forEach((key, index) => {
    let value = obj[key]
    if (index !== 0) {
      outputString = outputString + ', '
    }
    if (value === Object(value) && Object.prototype.toString.call(value) !== '[object Array]') { // if value is a non-array object
      outputString = outputString + `${key} : { ${recursiveObjectPrinter(value)} }`
    } else { // if value is primitive, null, array
      outputString = outputString + `${key} : ${value}`
    }
  })
  return outputString
}
const logStoreState = () => {
  let state = store.getState()
  console.log(recursiveObjectPrinter(state))
}

logStoreState()
// set up debug every time state changes
store.subscribe(() => logStoreState())

const fs = new LightningFS('fs', { wipe: true })
git.plugins.set('fs', fs)
/* const emitter = new EventEmitter()
git.plugins.set('emitter', emitter) */
// console.log('LightningFS and isomorphic-git initialized')
export { fs, logStoreState }
