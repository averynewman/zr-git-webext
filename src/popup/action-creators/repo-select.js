import { CHANGE_REPO, BEGIN_CLONE, CLONE_FAILURE, CLONE_SUCCESS } from '../../constants'

export function changeRepo (payload) {
  return {
    type: CHANGE_REPO,
    ...payload
  }
}

export function startClone (payload) {
  return {
    type: BEGIN_CLONE,
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
