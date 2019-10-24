import * as git from 'isomorphic-git'
import 'babel-polyfill'
import { START_FETCH, START_COMMIT, FETCH_FAILURE, FETCH_SUCCESS, repoDirectory, proxyUrl } from '../../constants'

function startFetch (payload) {
  // console.log('clone starting in background')
  return {
    type: START_FETCH,
    payload
  }
}

function fetchSuccess (payload) {
  // console.log('clone starting in background')
  return {
    type: FETCH_SUCCESS,
    payload
  }
}

function fetchFailure (payload) {
  // console.log('clone starting in background')
  return {
    type: FETCH_FAILURE,
    payload
  }
}

/* export function fetch () {
  console.log('fetching')
  return async function (dispatch, getState) {
    dispatch(startFetch())
    let state = getState()
    git.fetch({ dir: repoDirectory, corsProxy: proxyUrl, url: state.repoSelect.repoUrl, ref: state.branches.currentBranch }).then((success) => {
      console.log('fetch succeeded')
      dispatch(fetchFailure())
      return success
    }, (error) => {
      console.log(`fetch failed with error ${error}`)
      dispatch(fetchSuccess())
      throw error
    })
  }
} */
