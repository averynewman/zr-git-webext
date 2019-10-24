import { POPUP_FETCH, POPUP_COMMIT } from '../../constants'

export function startFetch (payload) {
  return {
    type: POPUP_FETCH,
    payload
  }
}

export function startCommit (payload) {
  return {
    type: POPUP_COMMIT,
    payload
  }
}
