import { STATUS_LOCK, STATUS_UNLOCK, STATUS_SET_MESSAGE } from '../../constants'

export function statusLock (payload) {
  return {
    type: STATUS_LOCK,
    ...payload
  }
}

export function statusUnlock (payload) {
  return {
    type: STATUS_UNLOCK,
    ...payload
  }
}

export function statusSetMessage (payload) {
  return {
    type: STATUS_SET_MESSAGE,
    ...payload
  }
}
