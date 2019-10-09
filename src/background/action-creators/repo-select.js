import * as git from 'isomorphic-git'
import 'babel-polyfill'

// import { logStoreState } from '../index'
import { START_CLONE, START_ERASE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS, repoDirectory } from '../../constants'
import { clearFilesystem } from './clear-filesystem'
import { updateBranches } from './branches'

export function startClone (payload) {
  // console.log('clone starting in background')
  return {
    type: START_CLONE,
    payload
  }
}

export function repoChangeFailure (payload) {
  // console.log('clone failed in background')
  return {
    type: REPO_CHANGE_FAILURE,
    payload
  }
}

export function repoChangeSuccess (payload) {
  // console.log(`clone succeeded with path ${payload.repoPath}`)
  return {
    type: REPO_CHANGE_SUCCESS,
    payload
  }
}

export function startErase (payload) {
  // console.log('erase starting in background')
  return {
    type: START_ERASE,
    payload
  }
}

export function changeRepo (payload) {
  const repoPath = payload.payload
  // console.log(`changeRepo request received with url https://github.com/${repoPath}.git`)
  return async function (dispatch) {
    // console.log('changeRepo thunk started')
    dispatch(startErase())
    // console.log('startErase dispatched')
    return clearFilesystem().then(
      success => {
        dispatch(startClone())
        return git.clone({
          dir: repoDirectory,
          corsProxy: 'https://cors.isomorphic-git.org',
          url: `https://github.com/${repoPath}.git`,
          depth: 2,
          singleBranch: false,
          noCheckout: true/* ,
          ref: 'greenkeeper/update-all' */
        })
      },
      error => {
        console.log(`changeRepo: filesystem clear failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        throw error
      }
    ).then(
      success => {
        // console.log(`changeRepo: repo change succeeded with path ${repoPath}`)
        dispatch(repoChangeSuccess({ repoPath: repoPath }))
        console.log('successful git clone, updating branches')
        return updateBranches(dispatch)
      },
      error => {
        console.log(`changeRepo: git clone (or filesystem clear) failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        throw error
      }
    ).catch((error) => {
      console.log(`changeRepo: error ${error} in updateBranches`)
      throw error
    })
  }
}
