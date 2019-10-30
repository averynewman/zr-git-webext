import * as git from 'isomorphic-git'
import 'babel-polyfill'

import { recursiveObjectPrinter, fs } from '../index'
import { START_FETCH, START_COMMIT, FETCH_FAILURE, FETCH_SUCCESS, repoDirectory, proxyUrl, ZRCodePath } from '../../constants'
import { setDoc } from '../../content-scripts/set-editor-text'

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

export function fetchReplace () {
  return async function (dispatch, getState) {
    await dispatch(fetch())
    let editorContents = fs.readFile(repoDirectory + ZRCodePath, { encoding: 'utf8' })
  }
}

function fetch () {
  console.log('fetching')
  return async function (dispatch, getState) {
    dispatch(startFetch())
    let state = getState()
    return git.fetch({ dir: repoDirectory, corsProxy: proxyUrl, url: state.repoSelect.repoUrl, ref: state.branches.currentBranch }).then((success) => {
      console.log(`fetch succeeded, returning ${recursiveObjectPrinter(success)}`)
      dispatch(fetchFailure())
      return success
    }, (error) => {
      console.log(`fetch failed with error ${error}`)
      dispatch(fetchSuccess())
      throw error
    })
  }
}
