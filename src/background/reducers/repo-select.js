import { CHANGE_REPO } from '../../constants'

const initialState = {
  repoUrl: 'https://github.com'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_REPO:
      return {
        ...state,
        repoUrl: action.repoUrl
      }
    default:
      return state
  }
}
