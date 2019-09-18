import { CHANGE_BRANCH } from '../../constants'

export function changeBranch (payload) {
  return {
    type: CHANGE_BRANCH,
    payload
  }
}
