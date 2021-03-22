import * as git from 'isomorphic-git'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// import { logStoreState } from '../index'
import { START_REPO_CHANGE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS, repoDirectory, proxyUrl, STATUS_SET_MESSAGE, STATUS_LOCK, STATUS_UNLOCK } from '../../constants'
import { updateBranches } from './branches'
import { fs, storage } from '../index'
// import { recursiveObjectPrinter } from '../../constants'

function startRepoChange (payload) {
  // console.log('clone starting in background')
  return {
    type: START_REPO_CHANGE,
    ...payload
  }
}

function repoChangeFailure (payload) {
  // console.log('clone failed in background')
  return {
    type: REPO_CHANGE_FAILURE,
    ...payload
  }
}

function repoChangeSuccess (payload) {
  // console.log(`clone succeeded with path ${payload.repoPath}`)
  return {
    type: REPO_CHANGE_SUCCESS,
    ...payload
  }
}

function statusLock (payload) {
  return {
    type: STATUS_LOCK,
    ...payload
  }
}

function statusUnlock (payload) {
  return {
    type: STATUS_UNLOCK,
    ...payload
  }
}

function statusSetMessage (payload) {
  return {
    type: STATUS_SET_MESSAGE,
    ...payload
  }
}

async function deleteFolderRecursive (path) { // clears nonempty folders by recursion
  // console.log(`deleteFolderRecursive called on ${path}`)
  const contents = await fs.promises.readdir(path)
  // console.log(`contents of ${path} are ${contents}`)
  const handleIndividual = async function (item) {
    const curPath = path + item
    const curPathStat = await fs.promises.lstat(curPath)
    if (curPathStat.isDirectory()) { // recurse
      // console.log(`${curPath} is a directory, recursing`)
      await deleteFolderRecursive(curPath + '/')
    } else { // delete file
      return fs.promises.unlink(curPath).then(async function () {
        // console.log(`unlink on ${curPath} succeeded `)
        // const contentsTesting = await fs.promises.readdir(path)
        // console.log(`after unlinking: contents of ${path} are ${contentsTesting}`)
        return true
      }, (err) => {
        // console.log(`unlink on ${curPath} failed with error ${err}`)
        throw err
      })
    }
  }
  const contentLength = contents.length
  for (let i = 0; i < contentLength; i++) {
    await handleIndividual(contents[i])
  }
  if (path === '/') {
    return true
  }
  return fs.promises.rmdir(path).then(() => {
    // console.log(`rmdir on ${path} succeeded`)
    return true
  }, async function (err) {
    // console.log(`rmdir on ${path} failed with error ${err}`)
    // const contentsError = await fs.promises.readdir(path)
    // console.log(`current contents of of ${path} are ${contentsError}`)
    throw err
  })
}

export function changeRepo (payload) {
  const repoUrl = payload.repoUrl
  console.log(`changing repo to ${repoUrl}`)
  return async function (dispatch) {
    // console.log('changeRepo thunk started')
    dispatch(startRepoChange())
    dispatch(statusLock())
    dispatch(statusSetMessage({ message: 'Changing repos...' }))
    // console.log('startErase dispatched')
    await deleteFolderRecursive('/').catch(error => {
      // console.log(`changeRepo: filesystem clear failed with error ${String(error)}`)
      dispatch(repoChangeFailure())
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Failed to change repos.' }))
      throw error
    })
    await git.clone({
      fs,
      dir: repoDirectory,
      corsProxy: proxyUrl,
      url: repoUrl,
      depth: 2,
      singleBranch: false,
      noCheckout: true
    }).then(
      success => {
        // console.log(`changeRepo: repo change succeeded with path ${repoPath}`)
        dispatch(repoChangeSuccess({ repoUrl: repoUrl }))
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Successfully changed repos.' }))
        storage.setItem('repoSelect.repoUrl', repoUrl)
        // console.log('successful git clone, updating branches')
        return success
      },
      error => {
        // console.log(`changeRepo: git clone (or filesystem clear) failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to change repo, please check your path and try again.' }))
        throw error
      }
    )
    return dispatch(updateBranches({ message: false, unlock: true })).then(success => {
      // console.log('updateBranches successful')
      return success
    }, error => {
      // console.log(`changeRepo: error ${error} in updateBranches`)
      throw error
    })
  }
}
