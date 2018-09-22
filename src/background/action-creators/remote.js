import * as types from '../../constants'

export const addRemote = remote => {
  return {
    type: types.ADD_REMOTE,
    remote
  }
}

export const removeRemote = name => {
  return {
    type: types.REMOVE_REMOTE,
    name
  }
}

export const renameRemote = (oldName, newName) => {
  return {
    type: types.RENAME_REMOTE,
    oldName,
    newName
  }
}
