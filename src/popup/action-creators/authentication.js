import { POPUP_SET_USER_INFO } from '../../constants'

export function setUserInfo (payload) {
  return {
    type: POPUP_SET_USER_INFO,
    ...payload
  }
}
