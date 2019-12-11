import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs, recursiveObjectPrinter } from '../index'
import { getDoc } from '../content-scripts/get-editor-text'
import { COMMIT_PUSH_FAILURE, COMMIT_PUSH_SUCCESS, repoDirectory, proxyUrl, ZRCodePath, START_COMMIT_PUSH } from '../../constants'
import { writeDoc } from './fetch-replace'

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
    dispatch(startCommitPush())

    const contentResponse = await getDoc().catch((error) => {
      dispatch(commitPushFailure())
      throw error
    })
    const editorContents = contentResponse.text
    const documentHeader = contentResponse.head
    const sha = documentHeader.sha
    const logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    if (sha !== logOutput[0].oid) {
      console.log(`commits not equal, aborting. Document is ${sha}, most recent is ${logOutput[0].oid}`)
      return dispatch(commitPushFailure())
    }

    await fs.promises.writeFile(repoDirectory + '/' + ZRCodePath, editorContents).catch((error) => {
      dispatch(commitPushFailure())
      throw error
    })
    await git.add({ dir: repoDirectory, filepath: ZRCodePath }).catch((error) => {
      dispatch(commitPushFailure())
      throw error
    })
    await git.commit({
      dir: repoDirectory,
      message: commitMessage,
      author: { name: getState().authentication.name, email: getState().authentication.email },
      ref: getState().branches.currentBranch
    }).catch((error) => {
      dispatch(commitPushFailure())
      throw error
    })

    await git.push({
      dir: repoDirectory,
      noGitSuffix: true,
      ref: getState().branches.currentBranch,
      remote: 'origin',
      corsProxy: proxyUrl,
      token: getState().authentication.token,
      oauth2format: 'github',
      remoteRef: `refs/heads/${getState().branches.currentBranch}`
    }).then((success) => {
      console.log(`push succeeded with info ${recursiveObjectPrinter(success)}`)
      dispatch(commitPushSuccess())
      return success
    }, (error) => {
      console.log(`push failed with error ${error}`)
      dispatch(commitPushFailure())
      throw error
    })

    await dispatch(writeDoc())
  }
}
