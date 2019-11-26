import '@babel/polyfill'

import { getDoc } from '../content-scripts/get-editor-text'

export function testGet () {
  return async function (dispatch, getState) {
    let retrievedText = await getDoc().then((success) => {
      return success
    }, (error) => {
      throw error
    })
    console.log(retrievedText)
  }
}
