import * as git from 'isomorphic-git'
import '@babel/polyfill'

// import { logStoreState } from '../index'
import { START_CLONE, START_ERASE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS, repoDirectory, proxyUrl } from '../../constants'
import { clearFilesystem } from './clear-filesystem'
import { updateBranches } from './branches'
// import { recursiveObjectPrinter } from '../index'

function startClone (payload) {
  // console.log('clone starting in background')
  return {
    type: START_CLONE,
    payload
  }
}

function repoChangeFailure (payload) {
  // console.log('clone failed in background')
  return {
    type: REPO_CHANGE_FAILURE,
    payload
  }
}

function repoChangeSuccess (payload) {
  // console.log(`clone succeeded with path ${payload.repoPath}`)
  return {
    type: REPO_CHANGE_SUCCESS,
    payload
  }
}

function startErase (payload) {
  // console.log('erase starting in background')
  return {
    type: START_ERASE,
    payload
  }
}

export function changeRepo (payload) {
  const repoUrl = payload.payload.repoUrl // why on earth is this payload.payload instead of just payload? because redux-webext gives as the argument of background changeRepo
  // the ENTIRE object returned by popup changeRepo, minus type. I think. who the hell knows.
  // console.log(recursiveObjectPrinter(payload)) // tests the above assertion
  console.log(`changeRepo request received with url https://github.com/${repoUrl}.git`)
  return async function (dispatch) {
    // console.log('changeRepo thunk started')
    dispatch(startErase())
    // console.log('startErase dispatched')
    await clearFilesystem().catch(error => {
      console.log(`changeRepo: filesystem clear failed with error ${String(error)}`)
      dispatch(repoChangeFailure())
      throw error
    })
    dispatch(startClone())
    await git.clone({
      dir: repoDirectory,
      corsProxy: proxyUrl,
      url: repoUrl,
      depth: 2,
      singleBranch: false,
      noCheckout: true
    }).then(
      success => {
        // console.log(`changeRepo: repo change succeeded with path ${repoPath}`)
        dispatch(repoChangeSuccess({ repoUrl: repoUrl }))
        console.log('successful git clone, updating branches')
        return dispatch(updateBranches())
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
