import { POPUP_CHANGE_BRANCH, POPUP_UPDATE_BRANCHES, POPUP_CREATE_BRANCH } from '../../constants'

export function changeBranch (payload) {
  return {
    type: POPUP_CHANGE_BRANCH,
    ...payload
  }
}

export function updateBranches (payload) {
  return {
    type: POPUP_UPDATE_BRANCHES,
    ...payload
  }
}

export function createBranch (payload) {
  return {
    type: POPUP_CREATE_BRANCH,
    ...payload
  }
}
