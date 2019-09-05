import * as git from 'isomorphic-git'
import 'babel-polyfill'

import { fs, logStoreState } from '../index'
import { START_CLONE, START_ERASE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS } from '../../constants'

async function deleteFolderRecursive (path) { // clears nonempty folders by recursion
  var files = []
  files = await fs.promises.readdir(path).catch((err) => {
    console.log(`deleteFolderRecursive: readdir failed with error ${err}`)
    throw err
  })
  files.forEach(async function (file, index) {
    var curPath = path + '/' + file
    var curPathStat = await fs.promises.lstat(curPath).catch((err) => {
      console.log(`deleteFolderRecursive: lstat on path ${curPath} failed with error ${err}`)
      throw err
    })
    if (curPathStat.isDirectory()) { // recurse
      console.log(`${curPath} is a directory, recursing`)
      deleteFolderRecursive(curPath)
    } else { // delete file
      await fs.promises.unlink(curPath).catch((err) => {
        console.log(`deleteFolderRecursive: unlink on path ${curPath} failed with error ${err}`)
        throw err
      })
    }
  })
  await fs.promises.rmdir(path).catch((err) => {
    console.log(`deleteFolderRecursive: rmdir on path ${path} failed with error ${err}`)
    throw err
  })
};

async function clearFilesystem () {
  console.log('clearFilesystem: starting directory read')
  fs.promises.readdir('/').then(
    async pathArray => {
      console.log(`clearFilesystem: starting directory clear with folders ${String(pathArray)}`)
      let promises = []
      for (let i = 0; i < pathArray.length; i++) {
        promises.push(deleteFolderRecursive(`/${pathArray[i]}`).then(
          success => {
            return success
          },
          error => {
            console.log(`clearFilesystem: error in single deleteFolderRecursive promise from array, clearing path ${pathArray[i]}`)
            console.log(error)
            throw error
          }
        ))
      }
      try {
        const success1 = await Promise.all(promises)
        console.log('clearFilesystem: compiled deleteFolderRecursive promises succeeded')
        return success1
      } catch (error1) {
        console.log(`clearFilesystem: compiled deleteFolderRecursive promises failed with error ${String(error1)}`)
        throw error1
      }
    },
    error => {
      console.log(`clearFilesystem: filesystem read failed with error ${String(error)}`)
      throw error
    }
  )
}

export function startClone (payload) {
  console.log('clone starting in background')
  return {
    type: START_CLONE,
    payload
  }
}

export function repoChangeFailure (payload) {
  console.log('clone failed in background')
  return {
    type: REPO_CHANGE_FAILURE,
    payload
  }
}

export function repoChangeSuccess (payload) {
  console.log(`clone succeeded with path ${payload.repoPath}`)
  return {
    type: REPO_CHANGE_SUCCESS,
    payload
  }
}

export function startErase (payload) {
  console.log('erase starting in background')
  return {
    type: START_ERASE,
    payload
  }
}

export function changeRepo (payload) {
  const repoPath = payload.payload
  console.log(`changeRepo request received with url https://github.com/${repoPath}.git`)
  return async function (dispatch) {
    console.log('thunk started')
    dispatch(startErase())
    console.log('startErase dispatched')
    return clearFilesystem().then(
      success => {
        dispatch(startClone())
        return git.clone({
          dir: '/repoDirectory',
          corsProxy: 'https://cors.isomorphic-git.org',
          url: `https://github.com/${repoPath}.git`
        })
      },
      error => {
        console.log(`changeRepo: filesystem clear failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        throw error
      }
    ).then(
      success => {
        console.log(`changeRepo: repo change succeeded with path ${repoPath}`)
        return dispatch(repoChangeSuccess({ repoPath: repoPath }))
      },
      error => {
        console.log(`changeRepo: git clone (or filesystem clear) failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        throw error
      }
    ).then(
      success => { logStoreState() }, error => { throw error }
    )
  }
}
