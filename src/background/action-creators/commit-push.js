import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs } from '../index'
import { getDoc } from '../content-scripts/get-editor-text'
import { START_COMMIT, START_PUSH, COMMIT_PUSH_FAILURE, COMMIT_PUSH_SUCCESS, repoDirectory, proxyUrl, ZRCodePath, START_COMMIT_PUSH } from '../../constants'

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

function commit(editorContents) {
  console.log('writing and committing')
  return async function(dispatch) {
    await fs.promises.writeFile(repoDirectory + ZRCodePath, editorContents).then((success) => {
      console.log('file write succeeded')
      return success
    }, (error) => {
      console.log(`write failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    await git.commit({ dir: repoDirectory, message: 'Placeholder commit message'}).then((success) => {
      console.log('commit write succeeded')
      return success
    }, (error) => {
      console.log(`commit failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
  }
}