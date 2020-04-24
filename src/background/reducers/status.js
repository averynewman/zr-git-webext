import {
  statusDefault, STATUS_SET_MESSAGE, STATUS_LOCK, STATUS_UNLOCK
} from '../../constants'

var defaultSubstate = {
  locked: false,
  statusMessage: statusDefault
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case STATUS_LOCK:
      output.locked = true
      break
    case STATUS_UNLOCK:
      output.locked = false
      break
    case STATUS_SET_MESSAGE:
      output.statusMessage = action.message
      break
  }
  return output
}
