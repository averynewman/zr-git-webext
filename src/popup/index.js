import 'chrome-browser-object-polyfill'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createUIStore } from 'redux-webext'

import './index.scss'
import Popup from './containers/popup'

createUIStore().then((store) => {
  ReactDOM.render(
    <Provider store={store}>
      <Popup />
    </Provider>,
    document.getElementById('app'))
})
