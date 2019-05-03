import { CHANGE_REPO } from '../../constants'

export default (state, action) => {
  switch (action.type) {
    case CHANGE_REPO:
      let output = state
      output.repoUrl = ('https://github.com/' + action.repoUrl)
      console.log('oh god oh frick (inside reducer)')
      console.log(output)
      return output
    default:
      console.log('defaulted on inside reducer')
      return state

  }
}
