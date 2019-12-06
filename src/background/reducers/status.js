import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, START_REPO_CHANGE, REPO_CHANGE_SUCCESS, REPO_CHANGE_FAILURE, statusDefault } from '../../constants'

var defaultSubstate = {
  locked: false,
  statusMessage: statusDefault
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case START_REPO_CHANGE:
      output.locked = true
      output.statusMessage = 'Changing repos...'
      break
    case REPO_CHANGE_SUCCESS:
      output.statusMessage = 'Successfully changed repos'
      break
    case REPO_CHANGE_FAILURE:
      output.locked = false
      output.statusMessage = 'Failed to change repo'
      break
    case START_BRANCH_LIST_UPDATE:
      output.locked = true
      break
    case BRANCH_LIST_UPDATE_SUCCESS:
      output.locked = false
      break
    case START_BRANCH_CHANGE:
      output.locked = true
      output.statusMessage = 'Switching branches...'
      break
    case BRANCH_CHANGE_SUCCESS:
      output.locked = false
      output.statusMessage = 'Successfully switched branches'
      break
  }
  return output
}
