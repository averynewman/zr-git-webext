import * as git from 'isomorphic-git'
import 'babel-polyfill'

import { recursiveObjectPrinter, fs } from '../index'
import { START_FETCH, START_CHECKOUT, START_COMMIT, FETCH_REPLACE_FAILURE, START_REPLACE, repoDirectory, proxyUrl, ZRCodePath } from '../../constants'
import { setDoc } from '../content-scripts/set-editor-text'

function startFetch (payload) {
  // console.log('clone starting in background')
  return {
    type: START_FETCH,
    payload
  }
}

function startCheckout (payload) {
  // console.log('clone starting in background')
  return {
    type: START_CHECKOUT,
    payload
  }
}

function startReplace (payload) {
  // console.log('clone starting in background')
  return {
    type: START_REPLACE,
    payload
  }
}

function fetchReplaceFailure (payload) {
  // console.log('clone starting in background')
  return {
    type: FETCH_REPLACE_FAILURE,
    payload
  }
}

export function fetchReplace () {
  return async function (dispatch, getState) {
    await dispatch(fetch())
    await dispatch(checkout())
    let dirContents = await fs.promises.readdir(repoDirectory)
    console.log(`dirContents: ${dirContents}`)
    let editorContents = await fs.promises.readFile(repoDirectory + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).then((success) => {
      console.log(`file read succeeded`)
      return success
    }, (error) => {
      console.log(`file read failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
    dispatch(startReplace())
    await setDoc(editorContents).then((success) => {
      console.log(`setDoc succeeded`)
      return success
    }, (error) => {
      console.log(`setDoc failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
  }
}

function fetch () {
  console.log('fetching')
  return async function (dispatch, getState) {
    dispatch(startFetch())
    let state = getState()
    return git.fetch({ dir: repoDirectory, corsProxy: proxyUrl, url: state.repoSelect.repoUrl, ref: state.branches.currentBranch }).then((success) => {
      console.log(`fetch succeeded`)
      return success
    }, (error) => {
      console.log(`fetch failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
  }
}

function checkout () {
  console.log('checking out')
  return async function (dispatch, getState) {
    dispatch(startCheckout())
    let state = getState()
    return git.checkout({ dir: repoDirectory, ref: state.branches.currentBranch }).then((success) => {
      console.log('checkout succeeded')
      return success
    }, (error) => {
      console.log(`checkout failed with error ${error}`)
      dispatch(fetchReplaceFailure())
      throw error
    })
  }
}
