import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs } from '../index'
import { getDoc } from '../injected-scripts/get-editor-text'
import { repoDirectory, ZRCodePath, recursiveObjectPrinter } from '../../constants'
import { statusLock, statusUnlock, statusSetMessage } from './status'
import { writeDoc, pull, checkout } from './fetch-replace'
import { changeRepo } from './repo-select'
import { changeBranch } from './branches'
import { initiateMerge } from './merge'

export function commitPush (payload) {
  return async function (dispatch, getState) {
    dispatch(statusLock())
    dispatch(statusSetMessage({ message: 'Committing and pushing...' }))

    console.log('doing preliminary pull/checkout')
    await dispatch(pull()).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push. Check your internet connection and try again.' }))
      console.log(`preliminary pull/checkout failed with ${error}`)
      throw error
    })
    await dispatch(checkout()).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
      console.log(`preliminary pull/checkout failed with ${error}`)
      throw error
    })
    console.log('preliminary pull/checkout succeeded')

    const contentResponse = await getDoc().catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
      throw error
    })
    const editorContents = contentResponse.text
    const documentHeader = contentResponse.head
    const sha = documentHeader.sha
    var logOutput = await git.log({ dir: repoDirectory, ref: getState().branches.currentBranch })
    var ancestorList = []
    for (var i = 0; i < logOutput.length; i++) {
      ancestorList.push(logOutput[i].oid)
    }
    if (sha !== logOutput[0].oid) {
      if (!ancestorList.includes(sha)) {
        console.log(`commits not equal and document commit not ancestor of HEAD, aborting. Document is ${sha}, HEAD is ${ancestorList[0]}`)
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to commit and push. Sha does not match the current branch.' }))
      } else {
        console.log(`document commit (${sha}) is ancestor of HEAD (${ancestorList[0]}). initiating merge`)
        await dispatch(initiateMerge({ editorContents: editorContents, ancestorCommit: sha, ...payload }))
      }
    } else {
      await dispatch(commitPushInternal({ editorContents: editorContents, ...payload }))
    }
  }
}

export function commitPushInternal (payload) {
  return async function (dispatch, getState) {
    var commitMessage = payload.commitMessage
    if (commitMessage === undefined) {
      commitMessage = getState().merge.mergeStoredCommitMessage
    }
    var editorContents = payload.editorContents
    if (editorContents === undefined) {
      const contentResponse = await getDoc({ header: false }).catch((error) => {
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
        throw error
      })
      editorContents = contentResponse.text
    }
    await fs.promises.writeFile(repoDirectory + '/' + ZRCodePath, editorContents).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
      throw error
    })
    await git.add({ dir: repoDirectory, filepath: ZRCodePath }).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
      throw error
    })
    await git.commit({
      dir: repoDirectory,
      message: commitMessage,
      author: { name: getState().userInfo.name, email: getState().userInfo.email },
      ref: getState().branches.currentBranch
    }).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
      throw error
    })

    await git.push({
      dir: repoDirectory,
      noGitSuffix: true,
      ref: getState().branches.currentBranch,
      remote: 'origin',
      token: getState().userInfo.token,
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
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Successfully committed and pushed.' }))
      return success
    }, async function (error) {
      console.log(`push failed with error ${error}. fetching now`)
      const oldBranch = getState().branches.currentBranch
      await dispatch(changeRepo({ repoUrl: getState().repoSelect.repoUrl }))
      await dispatch(changeBranch({ branchName: oldBranch, write: true }))
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to commit and push.' }))
      throw error
    })
    var logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log(recursiveObjectPrinter(logOutput))
  }
}
