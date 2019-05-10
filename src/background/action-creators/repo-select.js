import { START_CLONE, CLONE_FAILURE, CLONE_SUCCESS } from '../../constants'

export function startClone (payload) {
  console.log('clone starting in background')
  return {
    type: START_CLONE,
    ...payload
  }
}

export function cloneFailure (payload) {
  console.log('clone failed in background')
  return {
    type: CLONE_FAILURE,
    ...payload
  }
}

export function cloneSuccess (payload) {
  console.log('clone succeeded with url ' + payload.repoUrl)
  return {
    type: CLONE_SUCCESS,
    ...payload
  }
}
