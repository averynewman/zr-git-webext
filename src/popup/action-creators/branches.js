import { POPUP_CHANGE_BRANCH, POPUP_RELOAD_BRANCHES } from '../../constants'

export function changeBranch (payload) {
  return {
    type: POPUP_CHANGE_BRANCH,
    ...payload
  }
}

export function reloadBranches (payload) {
  return {
    type: POPUP_RELOAD_BRANCHES,
    ...payload
  }
}
