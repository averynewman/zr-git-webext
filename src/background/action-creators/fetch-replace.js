import * as git from 'isomorphic-git'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { fs } from '../index'
import { repoDirectory, ZRCodePath } from '../../constants'
import { statusLock, statusUnlock, statusSetMessage } from './status'
import { setDoc } from '../injected-scripts/set-editor-text'

export function fetchReplace () {
  return async function (dispatch, getState) {
    dispatch(statusLock())
    dispatch(statusSetMessage({ message: 'Fetching and replacing...' }))
    await dispatch(pull()).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to fetch and replace. Check your internet connection and try again.' }))
      throw error
    })
    await dispatch(checkout()).catch((error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to fetch and replace.' }))
      throw error
    })
    await dispatch(writeDoc()).then((success) => {
      return success
    }, (error) => {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to fetch and replace. Check that there is an open ZR IDE tab.' }))
      throw error
    })
    dispatch(statusUnlock())
    dispatch(statusSetMessage({ message: 'Successfully fetched and replaced.' }))
  }
}

export function writeDoc () {
  console.log('writing doc')
  return async function (dispatch, getState) {
    let editorContents = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).then((success) => {
      console.log('file read succeeded')
      return success
    }, (error) => {
      console.log(`file read failed with error ${error}`)
      throw error
    })
    const logOutput = await git.log({ fs, dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    /* console.log('git log output for sha checking:')
    for (let i = 0; i < logOutput.length; i++) {
      console.log(`commit ${i} is ${recursiveObjectPrinter(logOutput[i])}`)
    } */
    const sha = logOutput[0].oid
    editorContents = `// { 'sha': '${sha}' } \n` + editorContents
    await setDoc(editorContents).then((success) => {
      console.log('setDoc succeeded')
      return success
    }, (error) => {
      console.log(`setDoc failed with error ${error}`)
      throw error
    })
  }
}

export function pull () {
  console.log('pulling')
  return async function (dispatch, getState) {
    return git.pull({ fs, dir: repoDirectory, url: getState().repoSelect.repoUrl, ref: getState().branches.currentBranch }).then((success) => {
      console.log('pull succeeded')
      return success
    }, (error) => {
      console.log(`pull failed with error ${error}`)
      throw error
    })
  }
}

export function checkout () {
  console.log('checking out')
  return async function (dispatch, getState) {
    return git.checkout({ fs, dir: repoDirectory, ref: getState().branches.currentBranch }).then((success) => {
      console.log('checkout succeeded')
      return success
    }, (error) => {
      console.log(`checkout failed with error ${error}`)
      throw error
    })
  }
}
