import * as git from 'isomorphic-git'
import '@babel/polyfill'

// import { logStoreState } from '../index'
import { START_CLONE, START_ERASE, REPO_CHANGE_FAILURE, REPO_CHANGE_SUCCESS, repoDirectory, proxyUrl } from '../../constants'
import { updateBranches } from './branches'
import { fs } from '../index'
// import { recursiveObjectPrinter } from '../index'

function startClone (payload) {
  // console.log('clone starting in background')
  return {
    type: START_CLONE,
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

function startErase (payload) {
  // console.log('erase starting in background')
  return {
    type: START_ERASE,
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
  // console.log(recursiveObjectPrinter(payload)) // tests the above assertion
  console.log(`changeRepo request received with url https://github.com/${repoUrl}.git`)
  return async function (dispatch) {
    // console.log('changeRepo thunk started')
    dispatch(startErase())
    // console.log('startErase dispatched')
    await deleteFolderRecursive('/').catch(error => {
      console.log(`changeRepo: filesystem clear failed with error ${String(error)}`)
      dispatch(repoChangeFailure())
      throw error
    })
    dispatch(startClone())
    return git.clone({
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
        return dispatch(updateBranches())
      },
      error => {
        console.log(`changeRepo: git clone (or filesystem clear) failed with error ${String(error)}`)
        dispatch(repoChangeFailure())
        throw error
      }
    ).then(success => {
      console.log('updateBranches successful')
      return success
    }, error => {
      console.log(`changeRepo: error ${error} in updateBranches`)
      throw error
    })
  }
}
