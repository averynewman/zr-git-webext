import {
  START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, repoDirectory, BRANCH_CREATION_SUCCESS, BRANCH_CREATION_FAILURE,
  START_BRANCH_CREATION, START_GET_CONTENTS, GET_CONTENTS_SUCCESS, GET_CONTENTS_FAILURE, proxyUrl, branchDefault, ZRCodePath
} from '../../constants'
import { recursiveObjectPrinter, fs } from '../index'
import { changeRepo } from './repo-select'
import * as git from 'isomorphic-git'
import { writeDoc } from './fetch-replace'

function startBranchListUpdate (payload) {
  // console.log('starting branch list update')
  return {
    type: START_BRANCH_LIST_UPDATE,
    ...payload
  }
}

function branchListUpdateSuccess (payload) {
  // console.log(`successfully updated branch list to ${payload.branchList}`)
  return {
    type: BRANCH_LIST_UPDATE_SUCCESS,
    ...payload
  }
}

function startBranchChange (payload) {
  // console.log(`starting change to branch ${payload.branchName}`)
  return {
    type: START_BRANCH_CHANGE,
    ...payload
  }
}

function branchChangeSuccess (payload) {
  // console.log(`successfully changed to branch ${payload.branchName}`)
  return {
    type: BRANCH_CHANGE_SUCCESS,
    ...payload
  }
}

function startGetContents (payload) {
  return {
    type: START_GET_CONTENTS,
    ...payload
  }
}

function getContentsSuccess (payload) {
  return {
    type: GET_CONTENTS_SUCCESS,
    ...payload
  }
}

function getContentsFailure (payload) {
  return {
    type: GET_CONTENTS_FAILURE,
    ...payload
  }
}

function startBranchCreation (payload) {
  return {
    type: START_BRANCH_CREATION,
    ...payload
  }
}

function branchCreationSuccess (payload) {
  return {
    type: BRANCH_CREATION_SUCCESS,
    ...payload
  }
}

function branchCreationFailure (payload) {
  return {
    type: BRANCH_CREATION_FAILURE,
    ...payload
  }
}
export function changeBranch (payload) {
  const branchName = payload.branchName
  const write = payload.write
  if (branchName === branchDefault) {
    return true
  }
  console.log(`switching to branch ${branchName}`)
  return async function (dispatch, getState) {
    dispatch(startBranchChange({ branchName: branchName }))
    // console.log('changeBranch thunk started')
    await git.fetch({ dir: repoDirectory, ref: branchName, depth: 5, url: getState().repoUrl }).then(
      (success) => {
        return success
      }, error => {
        console.log(`fetch failed with error ${error}`)
        throw error
      }
    )
    return git.checkout({ dir: repoDirectory, ref: branchName }).then(
      async function (success) {
        if (write) {
          await dispatch(writeDoc())
          dispatch(branchChangeSuccess({ branchName: branchName }))
        }
        return success
      }, error => {
        console.log(`checkout failed with error ${error}`)
        throw error
      }
    )
  }
}

export function getContents (payload) {
  const branchName = payload.branchName
  const oldBranchName = payload.oldBranchName
  let editorContents
  let failed = false
  if (branchName === branchDefault) {
    return true
  }
  return async (dispatch, getState) => {
    dispatch(startGetContents({ branchName: branchName }))
    await dispatch(changeBranch({ branchName: branchName, write: false }))

    editorContents = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).then((success) => {
      console.log('GETCONTENTS file read succeeded')
      console.log(editorContents)
      return success
    }, (error) => {
      failed = true
      console.log(`GETCONTENTS file read failed with error ${error}`)
      throw error
    })

    await dispatch(changeBranch({ branchName: oldBranchName, write: false }))
    if (!failed) {
      dispatch(getContentsSuccess({ branchName: oldBranchName }))
      return editorContents
    } else {
      dispatch(getContentsFailure({ branchName: oldBranchName }))
      return null
    }
    /*
    await git.fetch({ dir: repoDirectory, ref: branchName, depth: 5, url: getState().repoUrl }).then(
      (success) => {
        return success
      }, error => {
        dispatch(getContentsFailure({ branchName: branchName }))
        console.log(`GETCONTENTS fetch failed with error ${error}`)
        throw error
      }
    )
    var editorContents = await git.checkout({ dir: repoDirectory, ref: branchName }).then(
      async function () {
        let editorContents = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).then((success) => {
          console.log('GETCONTENTS file read succeeded')
          console.log(editorContents)
          return success
        }, (error) => {
          dispatch(getContentsFailure({ branchName: branchName }))
          console.log(`GETCONTENTS file read failed with error ${error}`)
          throw error
        })
        return editorContents
      }, error => {
        dispatch(getContentsFailure({ branchName: branchName }))
        console.log(`GETCONTENTS checkout failed with error ${error}`)
        throw error
      }
    )
    await git.fetch({ dir: repoDirectory, ref: oldBranchName, depth: 5, url: getState().repoUrl }).then(
      (success) => {
        return success
      }, error => {
        dispatch(getContentsFailure({ branchName: branchName }))
        console.log(`GETCONTENTS fetch failed with error ${error}`)
        throw error
      }
    )

    await git.checkout({ dir: repoDirectory, ref: branchName }).then(
      async function (success) {
        dispatch(getContentsSuccess({ branchName: branchName }))
        return success
      }, error => {
        dispatch(getContentsFailure({ branchName: branchName }))
        console.log(`GETCONTENTS checkout failed with error ${error}`)
        throw error
      }
    )
    return editorContents
    */
  }
}

export function updateBranches (payload) {
  const manual = payload.manual
  return async function (dispatch, getState) {
    dispatch(startBranchListUpdate({ manual: manual }))
    console.log('test1')
    await git.getRemoteInfo({ url: getState().repoSelect.repoUrl, corsProxy: proxyUrl }).then(
      output => {
        console.log('test2')
        console.log(recursiveObjectPrinter(output))
        const branches = Object.keys(output.refs.heads)
        const branchesFiltered = branches.filter(word => word !== 'HEAD')
        dispatch(branchListUpdateSuccess({ branchList: branchesFiltered, manual: manual }))
        console.log(`branchList updated to ${branchesFiltered}`)
        return output
      }, error => {
        console.log(`updateBranches failed with error ${error}`)
        throw error
      }
    )
  }
}

export function createBranch (payload) {
  const branchName = payload.name
  console.log(`Creating new branch ${branchName}`)
  return async function (dispatch, getState) {
    const oldBranch = getState().branches.currentBranch
    console.log('createBranch thunk started')
    dispatch(startBranchCreation({ branchName: branchName }))
    console.log('startBranchCreation dispatched')
    await git.branch({ dir: repoDirectory, ref: branchName, checkout: true }).then(
      (success) => {
        return success
      }, async function (error) {
        console.log(`creation failed with error ${error}`)
        dispatch(branchCreationFailure({ branchName: branchName, reset: true }))
        await dispatch(changeBranch({ branchName: oldBranch, write: true }))
        throw error
      }
    )
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
      dispatch(branchCreationSuccess())
      return success
    }, async function (error) {
      console.log(`push failed with error ${error}. fetching now`)
      await dispatch(changeRepo({ repoUrl: getState().repoSelect.repoUrl }))
      await dispatch(changeBranch({ branchName: oldBranch, write: true }))
      dispatch(branchCreationFailure({ reset: false }))
      throw error
    })
    const logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log(recursiveObjectPrinter(logOutput))
  }
}
