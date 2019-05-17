import { START_CLONE, START_ERASE, REPO_CHANGE_SUCCESS, REPO_CHANGE_FAILURE } from '../../constants'

var defaultSubstate = {
  erasing: false,
  cloning: false,
  validRepo: true,
  repoPath: 'default'
}

export default (state = defaultSubstate, action) => {
  let output = state
  switch (action.type) {
    case START_ERASE:
      output.cloning = false
      output.erasing = true
      output.validRepo = false
      break
    case START_CLONE:
      output.cloning = true
      output.erasing = false
      output.validRepo = false
      break
    case REPO_CHANGE_SUCCESS:
      output.cloning = false
      output.erasing = false
      output.validRepo = true
      output.repoPath = action.repoPath
      break
    case REPO_CHANGE_FAILURE:
      output.cloning = false
      output.erasing = false
      output.validRepo = false
      break
  }
  return output
}
