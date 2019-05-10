import { createStore } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import * as git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'

import { START_CLONE, CLONE_FAILURE, CLONE_SUCCESS } from '../constants'
import { startClone, cloneFailure, cloneSuccess } from './action-creators/repo-select'
import rootReducer from './reducers'
import EventEmitter from 'events'

const store = createStore(rootReducer)

const actions = {
  START_CLONE: startClone,
  CLONE_FAILURE: cloneFailure,
  CLONE_SUCCESS: cloneSuccess
}

createBackgroundStore({ store, actions })

// BrowserFS setup, deprecated
/* BrowserFS.configure({ fs: 'IndexedDB', options: {} }, function (err) {
  if (err) return console.log(err)
  const fs = BrowserFS.BFSRequire('fs')
  git.plugins.set('fs', fs)
}) */
const fs = new LightningFS('fs', { wipe: true })
git.plugins.set('fs', fs)
const emitter = new EventEmitter()
git.plugins.set('emitter', emitter)
console.log('LightningFS and isomorphic-git initialized')
export { emitter }
