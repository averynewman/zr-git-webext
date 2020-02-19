import * as diff3 from 'node-diff3'
import * as git from 'isomorphic-git'
import '@babel/polyfill'

import { fs } from '../index'
import { MERGE_STARTED, MERGE_RESOLVING, MERGE_RESOLVED, MERGE_ABORTED, MERGE_STARTING, MERGE_FAILURE, MERGE_RESOLVE_FAILURE, repoDirectory, ZRCodePath } from '../../constants'
import { setDoc } from '../content-scripts/set-editor-text'
import { getDoc } from '../content-scripts/get-editor-text'
import { commitPushInternal } from './commit-push'
import { writeDoc } from './fetch-replace'

function mergeStarting (payload) {
  // console.log('starting merge')
  return {
    type: MERGE_STARTING,
    ...payload
  }
}

function mergeStarted (payload) {
  // console.log('starting merge')
  return {
    type: MERGE_STARTED,
    ...payload
  }
}

function mergeResolving (payload) {
  return {
    type: MERGE_RESOLVING,
    ...payload
  }
}

function mergeResolved (payload) {
  // console.log('starting merge')
  return {
    type: MERGE_RESOLVED,
    ...payload
  }
}

function mergeAborted (payload) {
  // console.log('starting merge')
  return {
    type: MERGE_ABORTED,
    ...payload
  }
}

function mergeFailure (payload) {
  return {
    type: MERGE_FAILURE,
    ...payload
  }
}

function mergeResolveFailure (payload) {
  return {
    type: MERGE_RESOLVE_FAILURE,
    ...payload
  }
}

export function resolveMerge (payload) {
  return async function (dispatch, getState) {
    dispatch(mergeResolving())
    const contentResponse = await getDoc({ header: false }).catch(err => {
      dispatch(mergeResolveFailure())
      throw err
    })
    var editorContents = contentResponse.text.replace(/^\/\/.*\n/, '') // removes header line
    if (editorContents.includes('>>>>>>') || editorContents.includes('<<<<<<') || editorContents.includes('======')) {
      dispatch(mergeResolveFailure())
      throw new Error('Attempted merge text still contains conflict markers')
    }
    await dispatch(commitPushInternal({ ...payload, editorContents })).catch(err => {
      dispatch(mergeResolveFailure())
      throw err
    })
    await dispatch(writeDoc()).catch(err => {
      dispatch(mergeResolveFailure())
      throw err
    })
    dispatch(mergeResolved())
  }
}

export function abortMerge () {
  return async function (dispatch, getState) {
    await setDoc(getState().status.mergeStoredEditorContents)
    dispatch(mergeAborted())
  }
}

export function initiateMerge (payload) {
  return async function (dispatch, getState) {
    var myText = payload.editorContents
    var ancestorCommit = payload.ancestorCommit
    dispatch(mergeStarting({ message: payload.message, editorContents: `// { "sha": "${ancestorCommit}" } \n` + myText }))
    console.log('reading text of branch HEAD')
    var theirText = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).catch(err => {
      dispatch(mergeFailure())
      throw err
    })
    console.log('checking out common ancestor')
    await git.checkout({ dir: repoDirectory, ref: ancestorCommit }).catch(err => {
      dispatch(mergeFailure())
      throw err
    })
    console.log('reading text of ancestor')
    var ancestorText = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).catch(err => {
      dispatch(mergeFailure())
      throw err
    })
    console.log('checking out branch HEAD')
    await git.checkout({ dir: repoDirectory, ref: getState().branches.currentBranch }).catch(err => {
      dispatch(mergeFailure())
      throw err
    })
    const mergeObj = diff3.merge(myText, ancestorText, theirText)
    const mergeArr = mergeObj.result
    var mergeText = `// Merge in progress on ancestor ${ancestorCommit}\n` + mergeArr.join('')
    mergeText = mergeText.replace(/\n+/, '\n')
    console.log('writing merge text to editor')
    await setDoc(mergeText).catch(err => {
      dispatch(mergeFailure())
      throw err
    })
    dispatch(mergeStarted())
  }
}
