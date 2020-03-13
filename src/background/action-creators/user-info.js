import { DELETE_USER_INFO, SET_USER_INFO, recursiveObjectPrinter } from '../../constants'
import { storage } from '../index'

export function setUserInfo (payload) {
  storage.setItem('userInfo.name', payload.name)
  storage.setItem('userInfo.email', payload.email)
  storage.setItem('userInfo.token', payload.token)
  console.log(`set storage userInfo to ${recursiveObjectPrinter({ token: payload.token, name: payload.name, email: payload.email })}`)
  return {
    type: SET_USER_INFO,
    ...payload
  }
}

export function deleteUserInfo (payload) {
  storage.setItem('userInfo.name', null)
  storage.setItem('userInfo.email', null)
  storage.setItem('userInfo.token', null)
  return {
    type: DELETE_USER_INFO,
    ...payload
  }
}
