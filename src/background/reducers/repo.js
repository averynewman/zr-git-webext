const initialState = {
  remotes: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_REMOTE':
      // no duplicate names allowed
      if (state.remotes.findIndex((remote) => remote.name === action.repoName) === -1) {
        break
      }
      const newRemote = {
        name: action.name,
        url: action.cloneUrl,
        credential: action.credential
      }
      state.remotes = [...state.remotes, newRemote]
      return state
    case 'REMOVE_REMOTE':
      state.remotes = state.remotes.filter((remote) => remote.name !== action.name)
      return state
  }
}
