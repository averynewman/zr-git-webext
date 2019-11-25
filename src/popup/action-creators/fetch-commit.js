import { POPUP_FETCH_REPLACE, POPUP_COMMIT, POPUP_TEST } from '../../constants'

export function startFetch (payload) {
  return {
    type: POPUP_FETCH_REPLACE,
    payload
  }
}

export function startCommit (payload) {
  return {
    type: POPUP_COMMIT,
    payload
  }
}

export function testButton (payload) {
  return {
    type: POPUP_TEST,
    payload
  }
}