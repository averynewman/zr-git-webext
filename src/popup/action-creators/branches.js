import { CHANGE_BRANCH, RELOAD_BRANCHES } from '../../constants'

export function changeBranch (payload) {
  return {
    type: CHANGE_BRANCH,
    payload
  }
}

export function reloadBranches (payload) {
  return {
    type: RELOAD_BRANCHES,
    payload
  }
}
