import { DELETE_USER_INFO, SET_USER_INFO } from '../../constants'
import { recursiveObjectPrinter } from '..'


export function setUserInfo (payload) {
  console.log(`setting user info to ${recursiveObjectPrinter(payload)}`)
  return {
    type: SET_USER_INFO,
    payload
  }
}

export function deleteUserInfo (payload) {
  return {
    type: DELETE_USER_INFO,
    payload
  }
}
