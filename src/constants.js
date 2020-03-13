export const START_REPO_CHANGE = 'START_REPO_CHANGE'
export const REPO_CHANGE_FAILURE = 'REPO_CHANGE_FAILURE'
export const REPO_CHANGE_SUCCESS = 'REPO_CHANGE_SUCCESS'
export const POPUP_CHANGE_REPO = 'POPUP_CHANGE_REPO'
export const POPUP_CHANGE_BRANCH = 'POPUP_CHANGE_BRANCH'
export const POPUP_CREATE_BRANCH = 'POPUP_CREATE_BRANCH'
export const START_BRANCH_LIST_UPDATE = 'START_BRANCH_LIST_UPDATE'
export const BRANCH_LIST_UPDATE_SUCCESS = 'BRANCH_LIST_UPDATE_SUCCESS'
export const BRANCH_LIST_UPDATE_FAILURE = 'BRANCH_LIST_UPDATE_FAILURE'
export const START_BRANCH_CHANGE = 'START_BRANCH_CHANGE'
export const BRANCH_CHANGE_SUCCESS = 'BRANCH_CHANGE_SUCCESS'
export const BRANCH_CHANGE_FAILURE = 'BRANCH_CHANGE_FAILURE'
export const START_BRANCH_CREATION = 'START_BRANCH_CREATION'
export const BRANCH_CREATION_SUCCESS = 'BRANCH_CREATION_SUCCESS'
export const BRANCH_CREATION_FAILURE = 'BRANCH_CREATION_FAILURE'
export const START_GET_CONTENTS = 'START_GET_CONTENTS'
export const GET_CONTENTS_SUCCESS = 'GET_CONTENTS_SUCCESS'
export const GET_CONTENTS_FAILURE = 'GET_CONTENTS_FAILURE'
export const POPUP_UPDATE_BRANCHES = 'POPUP_UPDATE_BRANCHES'
export const START_COMMIT_PUSH = 'START_COMMIT_PUSH'
export const POPUP_FETCH_REPLACE = 'POPUP_FETCH_REPLACE'
export const POPUP_COMMIT_PUSH = 'POPUP_COMMIT_PUSH'
export const FETCH_REPLACE_FAILURE = 'FETCH_REPLACE_FAILURE'
export const START_FETCH_REPLACE = 'START_FETCH_REPLACE'
export const FETCH_REPLACE_SUCCESS = 'FETCH_REPLACE_SUCCESS'
export const COMMIT_PUSH_FAILURE = 'COMMIT_PUSH_FAILURE'
export const COMMIT_PUSH_SUCCESS = 'PUSH_SUCCESS'
export const POPUP_SET_USER_INFO = 'POPUP_SET_USER_INFO'
export const POPUP_DELETE_USER_INFO = 'POPUP_DELETE_USER_INFO'
export const SET_USER_INFO = 'SET_USER_INFO'
export const DELETE_USER_INFO = 'DELETE_USER_INFO'
export const MERGE_STARTING = 'MERGE_STARTING'
export const MERGE_STARTED = 'MERGE_STARTED'
export const MERGE_ABORTED = 'MERGE_ABORTED'
export const MERGE_RESOLVING = 'MERGE_RESOLVING'
export const MERGE_RESOLVED = 'MERGE_RESOLVED'
export const MERGE_FAILURE = 'MERGE_FAILURE'
export const MERGE_RESOLVE_FAILURE = 'MERGE_RESOLVE_FAILURE'
export const POPUP_RESOLVE_MERGE = 'POPUP_RESOLVE_MERGE'
export const POPUP_ABORT_MERGE = 'POPUP_ABORT_MERGE'

export const repoDirectory = '/repoDirectory'
export const branchDefault = '!default currentBranch value'
export const repoDefault = '!default repoUrl value'
export const nameDefault = '!default name value'
export const emailDefault = '!default email value'
export const tokenDefault = '!default token value'
export const proxyUrl = 'https://cors.isomorphic-git.org'
export const ZRCodePath = 'main.cpp'
export const statusDefault = 'Nothing to report'

export function recursiveObjectPrinter (obj) { // this breaks on functions or objects with function-valued attributes. don't use it for those.
  if (Object.prototype.toString.call(obj) === '[object Array]') { // if obj is just an array
    return `[${obj}]`
  } else if (typeof obj === 'string' || obj instanceof String) { // if obj is string
    return `${JSON.stringify(obj)}` // convert to string literal (turn special characters into other stuff)
  } else if (obj !== Object(obj)) { // if obj is not an object. triggers when obj is null or a non-string primitive
    return `${obj}`
  }
  let outputString = ''
  Object.keys(obj).forEach((key, index) => {
    const value = obj[key]
    if (index !== 0) {
      outputString = outputString + ', '
    }
    outputString = outputString + `${key} : ${recursiveObjectPrinter(value)}`
  })
  return `{ ${outputString} }`
}
