import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs, recursiveObjectPrinter } from '../index'
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

export function commitPush () {
  return async function (dispatch, getState) {
    dispatch(startCommitPush())
    const state = getState()
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
    await git.commit({
      dir: repoDirectory,
      message: 'Placeholder commit message',
      author: { name: state.authentication.name, email: state.authentication.email },
      ref: state.branches.currentBranch
    }).then((success) => {
      console.log('commit succeeded')
      return success
    }, (error) => {
      console.log(`commit failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    console.log('git log output before push below')
    const logOutput = await git.log({ dir: repoDirectory, depth: 5, ref: state.branches.currentBranch })
    for (let i = 0; i < logOutput.length; i++) {
      console.log(`commit ${i} is ${recursiveObjectPrinter(logOutput[i])}`)
    }
    return git.push({
      dir: repoDirectory,
      noGitSuffix: true,
      ref: state.branches.currentBranch,
      remote: 'origin',
      corsProxy: proxyUrl,
      token: state.authentication.token,
      oauth2format: 'github',
      remoteRef: `refs/heads/${state.branches.currentBranch}`
    }).then((success) => {
      console.log('push succeeded')
      console.log(`push info was ${recursiveObjectPrinter(success)}`)
      dispatch(commitPushSuccess())
      return success
    }, (error) => {
      console.log(`push failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
  }
}
