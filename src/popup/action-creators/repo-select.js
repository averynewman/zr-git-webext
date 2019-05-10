import { START_CLONE, CLONE_FAILURE, CLONE_SUCCESS } from '../../constants'

export function startClone (payload) {
  return {
    type: START_CLONE,
    ...payload
  }
}

export function cloneFailure (payload) {
  return {
    type: CLONE_FAILURE,
    ...payload
  }
}

export function cloneSuccess (payload) {
  return {
    type: CLONE_SUCCESS,
    ...payload
  }
}
