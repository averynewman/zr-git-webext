import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, branchDefault, START_REPO_CHANGE, BRANCH_CHANGE_FAILURE } from '../../constants'

var defaultSubstate = {
  currentBranch: branchDefault,
  branchList: [],
  switching: false,
  updating: false
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case START_REPO_CHANGE:
      output.branchList = []
      output.currentBranch = branchDefault
      break
    case START_BRANCH_LIST_UPDATE:
      output.updating = true
      break
    case BRANCH_LIST_UPDATE_SUCCESS:
      output.branchList = action.branchList
      output.updating = false
      break
    case START_BRANCH_CHANGE:
      output.switching = true
      output.currentBranch = action.branchName
      break
    case BRANCH_CHANGE_SUCCESS:
      output.switching = false
      break
    case BRANCH_CHANGE_FAILURE:
      output.currentBranch = branchDefault
      break
  }
  return output
}
