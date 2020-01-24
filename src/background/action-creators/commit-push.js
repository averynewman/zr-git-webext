import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs } from '../index'
import { getDoc } from '../content-scripts/get-editor-text'
import { COMMIT_PUSH_FAILURE, COMMIT_PUSH_SUCCESS, repoDirectory, ZRCodePath, START_COMMIT_PUSH, recursiveObjectPrinter } from '../../constants'
import { writeDoc, pull, checkout } from './fetch-replace'
import { changeRepo } from './repo-select'
import { changeBranch } from './branches'

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

    console.log('doing preliminary pull/checkout')
    await dispatch(pull()).catch((error) => {
      dispatch(commitPushFailure())
      console.log(`preliminary pull/checkout failed with ${error}`)
      throw error
    })
    await dispatch(checkout()).catch((error) => {
      dispatch(commitPushFailure())
      console.log(`preliminary pull/checkout failed with ${error}`)
      throw error
    })
    console.log('preliminary pull/checkout succeeded')

    const contentResponse = await getDoc().catch((error) => {
      dispatch(commitPushFailure())
      throw error
    })
    const editorContents = contentResponse.text
    const documentHeader = contentResponse.head
    const sha = documentHeader.sha
    let logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
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
      token: getState().authentication.token,
      oauth2format: 'github',
      remoteRef: `refs/heads/${getState().branches.currentBranch}`
    }).then((success) => {
      if (success.ok[0] === 'unpack') {
        return success
      } else {
        throw new Error(`push failed with errors ${recursiveObjectPrinter(success.errors)}`)
      }
    }).then(async function (success) {
      console.log(`push succeeded with info ${recursiveObjectPrinter(success)}`)
      await dispatch(writeDoc())
      await git.checkout({ dir: repoDirectory, ref: getState().branches.currentBranch })
      dispatch(commitPushSuccess())
      return success
    }, async function (error) {
      console.log(`push failed with error ${error}. fetching now`)
      const oldBranch = getState().branches.currentBranch
      await dispatch(changeRepo({ repoUrl: getState().repoSelect.repoUrl }))
      await dispatch(changeBranch({ branchName: oldBranch }))
      dispatch(commitPushFailure())
      throw error
    })
    logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log(recursiveObjectPrinter(logOutput))
  }
}
