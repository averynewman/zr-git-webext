import * as git from 'isomorphic-git'
import '@babel/polyfill'

// import { logStoreState } from '../index'
import { START_REPO_CHANGE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS, repoDirectory, proxyUrl } from '../../constants'
import { updateBranches } from './branches'
import { fs } from '../index'
// import { recursiveObjectPrinter } from '../index'

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
  // console.log(`changeRepo request received with url ${repoUrl}`)
  return async function (dispatch) {
    // console.log('changeRepo thunk started')
    dispatch(startRepoChange())
    // console.log('startErase dispatched')
    await deleteFolderRecursive('/').catch(error => {
      // console.log(`changeRepo: filesystem clear failed with error ${String(error)}`)
      dispatch(repoChangeFailure())
      throw error
    })
    await git.clone({
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
        // console.log('successful git clone, updating branches')
        return success
      },
      error => {
        // console.log(`changeRepo: git clone (or filesystem clear) failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        throw error
      }
    )
    return dispatch(updateBranches()).then(success => {
      // console.log('updateBranches successful')
      return success
    }, error => {
      // console.log(`changeRepo: error ${error} in updateBranches`)
      throw error
    })
  }
}
