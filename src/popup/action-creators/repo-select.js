import { POPUP_CHANGE_REPO } from '../../constants'

export function changeRepo (payload) {
  return {
    type: POPUP_CHANGE_REPO,
    ...payload
  }
}
