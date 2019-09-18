import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS } from '../../constants'

var defaultSubstate = {
  currentBranch: 'master',
  branchList: [],
  switching: false,
  updating: false
}

export default (state = defaultSubstate, action) => {
  let output = state
  switch (action.type) {
    case START_BRANCH_LIST_UPDATE:
      output.updating = true
      break
    case BRANCH_LIST_UPDATE_SUCCESS:
      output.branchList = action.payload.branchList
      output.updating = false
      break
    case START_BRANCH_CHANGE:
      output.switching = true
      break
    case BRANCH_CHANGE_SUCCESS:
      output.currentBranch = action.payload.branchName
      output.switching = false
      break
  }
  return output
}
