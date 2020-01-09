import { BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, branchDefault, START_REPO_CHANGE, START_BRANCH_CREATION, BRANCH_CHANGE_FAILURE, BRANCH_CREATION_FAILURE } from '../../constants'

var defaultSubstate = {
  currentBranch: branchDefault,
  branchList: []
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case START_REPO_CHANGE:
      output.branchList = []
      output.currentBranch = branchDefault
      break
    case BRANCH_LIST_UPDATE_SUCCESS:
      output.branchList = action.branchList
      if (!output.branchList.includes(state.currentBranch)) {
        output.currentBranch = 'master'
      }
      break
    case START_BRANCH_CHANGE:
      output.switching = true
      output.currentBranch = action.branchName
      break
    case BRANCH_CHANGE_FAILURE:
      output.currentBranch = branchDefault
      break
    case START_BRANCH_CREATION:
      output.branchList.push(action.branchName)
      output.currentBranch = action.branchName
      break
    case BRANCH_CREATION_FAILURE:
      if (action.reset) {
        output.currentBranch = branchDefault
        output.branchList = output.branchList.filter(value => (value !== action.branchName))
      }
      break
  }
  return output
}
