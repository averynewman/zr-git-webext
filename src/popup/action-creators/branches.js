import { POPUP_CHANGE_BRANCH, POPUP_RELOAD_BRANCHES, POPUP_CREATE_BRANCH, POPUP_RESOLVE_MERGE, POPUP_ABORT_MERGE } from '../../constants'

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

export function createBranch (payload) {
  return {
    type: POPUP_CREATE_BRANCH,
    ...payload
  }
}

export function resolveMerge (payload) {
  return {
    type: POPUP_RESOLVE_MERGE,
    ...payload
  }
}

export function abortMerge (payload) {
  return {
    type: POPUP_ABORT_MERGE,
    ...payload
  }
}
