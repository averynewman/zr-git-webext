import { createStore, applyMiddleware } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import * as git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'
import thunkMiddleware from 'redux-thunk'
import '@babel/polyfill'

import { changeRepo } from './action-creators/repo-select'
import { changeBranch, updateBranches } from './action-creators/branches'
import { fetchReplace } from './action-creators/fetch-replace'
import { commitPush } from './action-creators/commit-push'
import rootReducer from './reducers'
import { repoDefault } from '../constants'
import { setUserInfo, deleteUserInfo } from '../background/action-creators/authentication'
// import EventEmitter from 'events'

const middlewares = [thunkMiddleware]

const initialState = {
  repoSelect: {
    erasing: false,
    cloning: false,
    validRepo: true,
    repoUrl: repoDefault
  }
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middlewares)
)

const actions = {
  POPUP_CHANGE_REPO: changeRepo,
  POPUP_CHANGE_BRANCH: changeBranch,
  POPUP_RELOAD_BRANCHES: updateBranches,
  POPUP_FETCH_REPLACE: fetchReplace,
  POPUP_COMMIT_PUSH: commitPush,
  POPUP_SET_USER_INFO: setUserInfo,
  POPUP_DELETE_USER_INFO: deleteUserInfo
}

createBackgroundStore({ store, actions })

const recursiveObjectPrinter = (obj) => { // this breaks on function-valued attributes, but our store state should never contain a function, unless future me does something stupid
  let outputString = ''
  Object.keys(obj).forEach((key, index) => {
    const value = obj[key]
    if (index !== 0) {
      outputString = outputString + ', '
    }
    if (value === Object(value) && Object.prototype.toString.call(value) !== '[object Array]') { // if value is a non-array object
      outputString = outputString + `${key} : ${recursiveObjectPrinter(value)}`
    } else { // if value is primitive, null, or array
      outputString = outputString + `${key} : ${value}`
    }
  })
  return `{ ${outputString} }`
}

const logStoreState = () => {
  const state = store.getState()
  console.log(recursiveObjectPrinter(state))
}

logStoreState()
// set up debug every time state changes
store.subscribe(() => logStoreState())

const fs = new LightningFS('fs', { wipe: true })
// console.log(recursiveObjectPrinter(fs))
git.plugins.set('fs', fs)
/* const emitter = new EventEmitter()
git.plugins.set('emitter', emitter) */
// console.log('LightningFS and isomorphic-git initialized')
export { fs, logStoreState, recursiveObjectPrinter } // NEVER import any of these in a popup file, it will cause webpack to bundle this with the popup and
// break your filesystem every time you open the popup
