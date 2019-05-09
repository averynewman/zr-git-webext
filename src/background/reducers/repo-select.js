import { CHANGE_REPO } from '../../constants'

export default (state, action) => {
  switch (action.type) {
    case CHANGE_REPO:
      let output = state
      output.repoUrl = ('https://github.com/' + action.repoUrl)
      return output
    default:
      return state
  }
}
