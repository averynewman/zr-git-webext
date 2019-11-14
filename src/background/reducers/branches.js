import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, START_ERASE, START_FETCH, FETCH_FAILURE, FETCH_SUCCESS, branchDefault } from '../../constants'

var defaultSubstate = {
  currentBranch: branchDefault,
  branchList: [],
  switching: false,
  updating: false,
  fetching: false
}

export default (state = defaultSubstate, action) => {
  let output = state
  switch (action.type) {
    case START_ERASE:
      output.banchList = []
      output.currentBranch = branchDefault
      break
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
    case START_FETCH:
      output.fetching = true
      break
    case FETCH_SUCCESS:
      output.fetching = false
      break
    case FETCH_FAILURE:
      output.fetching = false
      break
  }
  return output
}
