import { createStore } from 'redux'
import { createBackgroundStore } from 'redux-webext'

import { INCREASE } from '../constants'
import { increase } from './action-creators/counter'
import rootReducer from './reducers'

const store = createStore(rootReducer)

const actions = {}
actions[INCREASE] = increase

createBackgroundStore({ store, actions })
/* BrowserFS.configure({ fs: "IndexedDB", options: {} }, function (err) {
  if (err) return console.log(err);
  const fs = BrowserFS.BFSRequire("fs");
  const files = git.listFiles({fs, dir: '/'});
  console.log(files);
}); */
