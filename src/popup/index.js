import 'chrome-browser-object-polyfill'
import '@babel/polyfill'
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

export const recursiveObjectPrinter = (obj) => { // this breaks on function-valued attributes, but our store state should never contain a function, unless future me does something stupid
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