import { createStore } from 'redux'
import { createBackgroundStore } from 'redux-webext'
import { git } from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs'

import { INCREASE } from '../constants'
import { increase } from './action-creators/counter'
import rootReducer from './reducers'

const store = createStore(rootReducer)

const actions = {}
actions[INCREASE] = increase

createBackgroundStore({ store, actions })

// BrowserFS setup, deprecated
/* BrowserFS.configure({ fs: 'IndexedDB', options: {} }, function (err) {
  if (err) return console.log(err)
  const fs = BrowserFS.BFSRequire('fs')
  git.plugins.set('fs', fs)
}) */
const fs = new LightningFS('my-app')
git.plugins.set('fs', fs)
console.log('LightningFS and isomorphic-git initialized successfully')
