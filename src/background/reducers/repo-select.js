import { REPO_CHANGE_SUCCESS, REPO_CHANGE_FAILURE, repoDefault, START_REPO_CHANGE } from '../../constants'

var defaultSubstate = {
  switching: false,
  validRepo: false,
  repoUrl: repoDefault
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case START_REPO_CHANGE:
      output.switching = true
      output.validRepo = false
      break
    case REPO_CHANGE_SUCCESS:
      output.switching = false
      output.validRepo = true
      output.repoUrl = action.repoUrl
      break
    case REPO_CHANGE_FAILURE:
      output.switching = false
      output.validRepo = false
      break
  }
  return output
}
