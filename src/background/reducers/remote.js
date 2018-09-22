import {
  ADD_REMOTE,
  REMOVE_REMOTE
} from '../../constants'

import git from 'isomorphic-git'

git.listRemotes({dir: '.' })
.then(remotes => const initialState = remotes)

export default async (state = initialState, action) => {
  switch (action.type) {
    case ADD_REMOTE:
      await git.config({
        dir: '.',
        path: `remote.${action.name}.url`,
        value: action.url
      })
      return await git.listRemotes({dir: '.'})

    case REMOVE_REMOTE:
      await git.config({
        dir: '.',
        path: `remote.${action.name}`,
        value: null
      })
      return await git.listRemotes({dir: '.'})

    default:
      return state
  }
}
