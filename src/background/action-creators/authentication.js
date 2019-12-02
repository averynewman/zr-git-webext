import { DELETE_USER_INFO, SET_USER_INFO } from '../../constants'

export function setUserInfo (payload) {
  return {
    type: SET_USER_INFO,
    ...payload
  }
}

export function deleteUserInfo (payload) {
  return {
    type: DELETE_USER_INFO,
    ...payload
  }
}
