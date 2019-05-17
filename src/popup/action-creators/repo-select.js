import { CHANGE_REPO } from '../../constants'

export function changeRepo (payload) {
  return {
    type: CHANGE_REPO,
    ...payload
  }
}
