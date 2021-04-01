import { createStore, applyMiddleware } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import LightningFS from '@isomorphic-git/lightning-fs'
import thunkMiddleware from 'redux-thunk'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { changeRepo } from './action-creators/repo-select'
import { changeBranch, updateBranches, createBranch, getContents } from './action-creators/branches'
import { fetchReplace } from './action-creators/fetch-replace'
import { commitPush } from './action-creators/commit-push'
import rootReducer from './reducers'
import { repoDefault, recursiveObjectPrinter, tokenDefault, nameDefault, emailDefault } from '../constants'
import { setUserInfo } from './action-creators/user-info'
import { resolveMerge, abortMerge } from './action-creators/merge'

const middlewares = [thunkMiddleware]

const defaultState = {
  repoSelect: {
    switching: false,
    validRepo: false,
    repoUrl: repoDefault
  },
  userInfo: {
    token: tokenDefault,
    name: nameDefault,
    email: emailDefault
  }
}

const storage = window.localStorage
const userInfoStored = {
  name: storage.getItem('userInfo.name'),
  email: storage.getItem('userInfo.email'),
  token: storage.getItem('userInfo.token')
}
const repoSelectStored = {
  switching: false,
  validRepo: true,
  repoUrl: storage.getItem('repoSelect.repoUrl')
}

console.log(`storage testing: ${recursiveObjectPrinter(repoSelectStored)}, ${recursiveObjectPrinter(userInfoStored)}`)

Object.keys(userInfoStored).forEach(key => {
  userInfoStored[key] = userInfoStored[key] === null ? defaultState.userInfo[key] : userInfoStored[key]
})
Object.keys(repoSelectStored).forEach(key => {
  repoSelectStored[key] = repoSelectStored[key] === null ? defaultState.repoSelect[key] : repoSelectStored[key]
})

const startingState = { repoSelect: repoSelectStored, userInfo: userInfoStored } // change defaultState.repoSelect to repoSelectStored to enable repo persistence

const store = createStore(
  rootReducer,
  startingState,
  applyMiddleware(...middlewares)
)

console.log(`store state after init is ${recursiveObjectPrinter(store.getState())}`)

const actions = {
  POPUP_CHANGE_REPO: changeRepo,
  POPUP_CHANGE_BRANCH: changeBranch,
  POPUP_UPDATE_BRANCHES: updateBranches,
  POPUP_CREATE_BRANCH: createBranch,
  POPUP_FETCH_REPLACE: fetchReplace,
  POPUP_COMMIT_PUSH: commitPush,
  POPUP_SET_USER_INFO: setUserInfo,
  POPUP_RESOLVE_MERGE: resolveMerge,
  POPUP_ABORT_MERGE: abortMerge
}

createBackgroundStore({ store, actions })

const logStoreState = () => {
  const state = store.getState()
  console.log(recursiveObjectPrinter(state))
}

logStoreState()
// set up debug every time state changes
store.subscribe(() => logStoreState())

window.chrome.runtime.onConnect.addListener(function (port) {
  console.log(port)
  // console.assert(port.name === 'branchListPort')
  if (port.name === 'branchListPort') {
    port.onMessage.addListener(async function (msg) {
      console.log(`recieved msg: ${msg}`)
      if (msg.request === 'branchList') {
        port.postMessage({ branchList: store.getState().branches.branchList })
      }
      if (msg.request === 'contents') {
        const contents = await store.dispatch(getContents({ branchName: msg.branch, oldBranchName: store.getState().branches.currentBranch }))
        port.postMessage({ contents: contents })
      }
    })
  }
})

const fs = new LightningFS('fs', { wipe: true })
// console.log(recursiveObjectPrinter(fs))
// console.log('LightningFS and isomorphic-git initialized')
export { fs, logStoreState, storage } // never import any of these in a popup file, it will cause webpack to bundle this with the popup and
// break your filesystem every time you open the popup

if (store.getState().repoSelect.repoUrl !== repoDefault) {
  (async function handleStartupRepo () {
    console.log(`found stored repoUrl ${store.getState().repoSelect.repoUrl}, switching`)
    await store.dispatch(changeRepo({ repoUrl: store.getState().repoSelect.repoUrl }))
    console.log('finished switching (in async function)')
  })()
} else {
  console.log('did not find stored repoUrl')
}
console.log('finished handling stored repoUrl')
