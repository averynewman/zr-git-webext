import { POPUP_DELETE_USER_INFO, POPUP_SET_USER_INFO } from '../../constants'

export function setUserInfo (payload) {
  return {
    type: POPUP_SET_USER_INFO,
    ...payload
  }
}

export function deleteUserInfo (payload) {
  return {
    type: POPUP_DELETE_USER_INFO,
    ...payload
  }
}
