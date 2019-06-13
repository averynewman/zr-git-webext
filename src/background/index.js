import { createStore, applyMiddleware } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import * as git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'
import thunkMiddleware from 'redux-thunk'
import 'babel-polyfill'

import { changeRepo } from './action-creators/repo-select'
import rootReducer from './reducers'
import EventEmitter from 'events'

const middlewares = [thunkMiddleware]

const initialState = {
  repoSelect: {
    erasing: false,
    cloning: false,
    validRepo: true,
    repoPath: 'default'
  }
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middlewares)
)

const actions = {
  CHANGE_REPO: changeRepo
}

createBackgroundStore({ store, actions })

const fs = new LightningFS('fs', { wipe: true })
git.plugins.set('fs', fs)
const emitter = new EventEmitter()
git.plugins.set('emitter', emitter)
console.log('LightningFS and isomorphic-git initialized')
export { emitter, fs }
