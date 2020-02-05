import * as diff3 from 'node-diff3'
import { START_MERGE, MERGE_SUCCESS, ABORT_MERGE } from '../../constants'

function startMerge (payload) {
  // console.log('starting merge')
  return {
    type: START_MERGE,
    ...payload
  }
}

function mergeSuccess (payload) {
  // console.log('starting merge')
  return {
    type: MERGE_SUCCESS,
    ...payload
  }
}

function abortMergeActionCreator (payload) {
  // console.log('starting merge')
  return {
    type: ABORT_MERGE,
    ...payload
  }
}

export function resolveMerge () {
  return async function (dispatch, getState) {
    dispatch(mergeSuccess())
  }
}

export function abortMerge () {
  return async function (dispatch, getState) {
    dispatch(abortMergeActionCreator())
  }
}

export function initiateMerge (payload) {
  return async function (dispatch, getState) {
    var editorContents = payload.editorContents
    var ancestorCommit = payload.ancestorCommit
    dispatch(startMerge())
    diff3.merge()
  }
}
