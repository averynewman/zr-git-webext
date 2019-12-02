import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs } from '../index'
import { getDoc } from '../content-scripts/get-editor-text'
import { COMMIT_PUSH_FAILURE, COMMIT_PUSH_SUCCESS, repoDirectory, proxyUrl, ZRCodePath, START_COMMIT_PUSH } from '../../constants'

function startCommitPush (payload) {
  // console.log('clone starting in background')
  return {
    type: START_COMMIT_PUSH,
    ...payload
  }
}

function commitPushFailure (payload) {
  // console.log('clone starting in background')
  return {
    type: COMMIT_PUSH_FAILURE,
    ...payload
  }
}

function commitPushSuccess (payload) {
  // console.log('clone starting in background')
  return {
    type: COMMIT_PUSH_SUCCESS,
    ...payload
  }
}

export function commitPush (editorContents) {
  return async function (dispatch, getState) {
    dispatch(startCommitPush())
    const editorContents = await getDoc().then((success) => {
      console.log('getDoc succeeded')
      return success
    }, (error) => {
      console.log(`getDoc failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    await fs.promises.writeFile(repoDirectory + ZRCodePath, editorContents).then((success) => {
      console.log('file write succeeded')
      return success
    }, (error) => {
      console.log(`write failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    await git.commit({ dir: repoDirectory, message: 'Placeholder commit message' }).then((success) => {
      console.log('commit succeeded')
      return success
    }, (error) => {
      console.log(`commit failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    const state = getState()
    return git.push({ dir: repoDirectory, remote: 'origin', corsProxy: proxyUrl, token: state.token, oauth2format: 'github' }).then((success) => {
      console.log('push succeeded')
      dispatch(commitPushSuccess())
      return success
    }, (error) => {
      console.log(`push failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
  }
}
