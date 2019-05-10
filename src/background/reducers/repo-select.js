import { BEGIN_CLONE, CLONE_FAILURE, CLONE_SUCCESS } from '../../constants'

var defaultSubstate = {
  cloning: false,
  validRepo: true,
  repoUrl: 'https://github.com'
}

export default (state = defaultSubstate, action) => {
  let output = state
  switch (action.type) {
    case BEGIN_CLONE:
      output.cloning = true
      output.validRepo = false
      break
    case CLONE_FAILURE:
      output.cloning = false
      output.validRepo = false
      break
    case CLONE_SUCCESS:
      output.cloning = false
      output.validRepo = true
      output.repoUrl = action.repoUrl
      break
  }
  return output
}
