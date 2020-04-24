import { DELETE_USER_INFO, SET_USER_INFO, recursiveObjectPrinter } from '../../constants'
import { statusSetMessage } from './status'
import { storage } from '../index'

export function setUserInfo (payload) {
  return function (dispatch, getState) {
    storage.setItem('userInfo.name', payload.name)
    storage.setItem('userInfo.email', payload.email)
    storage.setItem('userInfo.token', payload.token)
    console.log(`set storage userInfo to ${recursiveObjectPrinter({ token: payload.token, name: payload.name, email: payload.email })}`)
    dispatch((function (payloadArg) {
      return {
        type: SET_USER_INFO,
        ...payloadArg
      }
    })(payload))
    dispatch(statusSetMessage({ message: 'User info successfully updated.' }))
  }
}

export function deleteUserInfo (payload) {
  return function (dispatch, getState) {
    storage.setItem('userInfo.name', null)
    storage.setItem('userInfo.email', null)
    storage.setItem('userInfo.token', null)
    console.log('delete storage userInfo')
    dispatch((function (payloadArg) {
      return {
        type: DELETE_USER_INFO,
        ...payloadArg
      }
    })(payload))
    dispatch(statusSetMessage({ message: 'User info deleted.' }))
  }
}
