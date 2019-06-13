import * as git from 'isomorphic-git'
import 'babel-polyfill'

import { fs } from '../index'
import { START_CLONE, START_ERASE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS } from '../../constants'

async function clearFilesystem () {
  console.log('clearFilesystem: starting directory read')
  fs.promises.readdir('/').then(
    pathArray => {
      console.log('clearFilesystem: starting directory clear with folders ' +
String(pathArray))
      let promises = []
      for (let i = 0; i < pathArray.length; i++) {
        promises.push(fs.promises.rmdir(pathArray[i]).then(
          success => {
            return success
          },
          error => {
            console.log('clearFilesystem: error in single rmdir promise from array, clearing path' +
pathArray[i])
            throw error
          }
        ))
      }
      return Promise.all(promises).then(
        success => {
          console.log('clearFilesystem: compiled rmdir promises succeeded')
          return success
        },
        error => {
          console.log('clearFilesystem: compiled rmdir promises failed with error ' +
String(error))
          throw error
        }
      )
    },
    error => {
      console.log('clearFilesystem: filesystem read failed with error ' +
String(error))
      throw error
    }
  )
}

export function startClone (payload) {
  console.log('clone starting in background')
  return {
    type: START_CLONE,
    ...payload
  }
}

export function repoChangeFailure (payload) {
  console.log('clone failed in background')
  return {
    type: REPO_CHANGE_FAILURE,
    ...payload
  }
}

export function repoChangeSuccess (payload) {
  console.log('clone succeeded with path ' + payload.repoPath)
  return {
    type: REPO_CHANGE_SUCCESS,
    ...payload
  }
}

export function startErase (payload) {
  console.log('erase starting in background')
  return {
    type: START_ERASE,
    ...payload
  }
}

export function changeRepo (repoPath) {
  console.log('changeRepo request received with url ' + 'https://github.com/' + repoPath + '.git')
  return async function (dispatch) {
    console.log('thunk started')
    dispatch(startErase())
    console.log('startErase dispatched')
    return clearFilesystem().then(
      success => {
        dispatch(startClone())
        return git.clone({
          dir: '/',
          corsProxy: 'https://cors.isomorphic-git.org',
          url: 'https://github.com/' + repoPath + '.git'
        })
      },
      error => {
        console.log('changeRepo: filesystem clear failed with error ' +
String(error))
        dispatch(repoChangeFailure())
        throw error
      }
    ).then(
      success => {
        console.log('changeRepo: repo change succeeded with path ' +
repoPath)
        return dispatch(repoChangeSuccess({ repoPath: repoPath }))
      },
      error => {
        console.log('changeRepo: git clone (or filesystem clear) failed with error ' +
        String(error))
        dispatch(repoChangeFailure())
        throw error
      }
    )
  }
}
