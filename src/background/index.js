import { createStore, applyMiddleware } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import * as diff3 from 'node-diff3'
import * as git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'
import thunkMiddleware from 'redux-thunk'
import '@babel/polyfill'

import { changeRepo } from './action-creators/repo-select'
import { changeBranch, updateBranches, createBranch } from './action-creators/branches'
import { fetchReplace } from './action-creators/fetch-replace'
import { commitPush } from './action-creators/commit-push'
import rootReducer from './reducers'
import { repoDefault, recursiveObjectPrinter } from '../constants'
import { setUserInfo, deleteUserInfo } from '../background/action-creators/authentication'
// import EventEmitter from 'events'

const middlewares = [thunkMiddleware]

const initialState = {
  repoSelect: {
    switching: false,
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
  POPUP_CREATE_BRANCH: createBranch,
  POPUP_FETCH_REPLACE: fetchReplace,
  POPUP_COMMIT_PUSH: commitPush,
  POPUP_SET_USER_INFO: setUserInfo,
  POPUP_DELETE_USER_INFO: deleteUserInfo
}

createBackgroundStore({ store, actions })

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

console.log('merge testing below')

const base = [1, 2, 3, 4, 5, 6].join('\n')
const left = [2, 9, 3, 7, 5, 6].join('\n') // delete 1, insert 9 between 2 and 3, change 4 to 7
const right = [1, 3, 8, 5, 12, 6].join('\n') // delete 2, change 4 to 8, insert 12 between 5 and 6
// const diffMergeIndices = diff3.diff3MergeIndices(left, base, right)
const diffMerge = diff3.diff3Merge(left, base, right, true)
const merge = diff3.merge(left, base, right) // this seems to be the good one
const mergeDigIn = diff3.mergeDigIn(left, base, right)

// console.log(`diffMergeIndices: ${recursiveObjectPrinter(diffMergeIndices)}`)
console.log('diffMerge:')
console.log(diffMerge)
console.log('merge:')
console.log(merge)
console.log('mergeDigIn:')
console.log(mergeDigIn)
