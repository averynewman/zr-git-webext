import { POPUP_FETCH_REPLACE, POPUP_COMMIT } from '../../constants'

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
