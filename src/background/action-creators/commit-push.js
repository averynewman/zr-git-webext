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

export function commitPush (payload) {
  return async function (dispatch, getState) {
    const commitMessage = payload.message
    console.log(`commit message is ${commitMessage}`)
    dispatch(startCommitPush())
    const contentResponse = await getDoc().then((success) => {
      console.log('getDoc succeeded')
      return success
    }, (error) => {
      console.log(`getDoc failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    const editorContents = contentResponse.text
    const documentHeader = contentResponse.head
    const sha = documentHeader.sha
    const logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log('git log output before commit below')
    for (let i = 0; i < logOutput.length; i++) {
      console.log(`commit ${i} is ${recursiveObjectPrinter(logOutput[i])}`)
    }
    if (sha !== logOutput[0].oid) {
      console.log(`commits not equal. Document is ${sha}, most recent is ${logOutput[0].oid}`)
      return dispatch(commitPushFailure())
    }
    console.log(`commits equal. Document is ${sha}, most recent is ${logOutput[0].oid}`)
    console.log(`editorContents are ${editorContents}`)
    await fs.promises.writeFile(repoDirectory + '/' + ZRCodePath, editorContents).then((success) => {
      console.log('file write succeeded')
      return success
    }, (error) => {
      console.log(`write failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })

    await git.add({
      dir: repoDirectory,
      filepath: ZRCodePath
    }).then((success) => {
      console.log('git add succeeded')
      return success
    }, (error) => {
      console.log(`git add failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    await git.commit({
      dir: repoDirectory,
      message: commitMessage,
      author: { name: getState().authentication.name, email: getState().authentication.email },
      ref: getState().branches.currentBranch
    }).then((success) => {
      console.log('commit succeeded')
      return success
    }, (error) => {
      console.log(`commit failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })
    /* console.log('git log output before push below')
    logOutput = await git.log({ dir: repoDirectory, depth: 5, ref: getState().branches.currentBranch })
    for (let i = 0; i < logOutput.length; i++) {
      console.log(`commit ${i} is ${recursiveObjectPrinter(logOutput[i])}`)
    } */
    return git.push({
      dir: repoDirectory,
      noGitSuffix: true,
      ref: getState().branches.currentBranch,
      remote: 'origin',
      corsProxy: proxyUrl,
      token: getState().authentication.token,
      oauth2format: 'github',
      remoteRef: `refs/heads/${getState().branches.currentBranch}`
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
