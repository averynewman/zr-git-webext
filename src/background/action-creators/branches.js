import {
  START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, BRANCH_LIST_UPDATE_FAILURE, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, BRANCH_CHANGE_FAILURE, repoDirectory,
  BRANCH_CREATION_SUCCESS, BRANCH_CREATION_FAILURE, START_BRANCH_CREATION, START_GET_CONTENTS, GET_CONTENTS_SUCCESS, GET_CONTENTS_FAILURE, proxyUrl, branchDefault,
  ZRCodePath, recursiveObjectPrinter
} from '../../constants'
import { fs } from '../index'
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

function branchListUpdateFailure (payload) {
  return {
    type: BRANCH_LIST_UPDATE_FAILURE,
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

function branchChangeFailure (payload) {
  return {
    type: BRANCH_CHANGE_FAILURE,
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
    await dispatch(updateBranches({ message: false, unlock: false }))
    // console.log('changeBranch thunk started')
    await git.fetch({ dir: repoDirectory, ref: branchName, depth: 5, url: getState().repoUrl }).then(
      (success) => {
        return success
      }, error => {
        console.log(`fetch failed with error ${error}`)
        dispatch(branchChangeFailure({ branchName: branchName }))
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
        dispatch(branchChangeFailure({ branchName: branchName }))
        throw error
      }
    )
  }
}

export function getContents (payload) {
  const branchName = payload.branchName
  const oldBranchName = payload.oldBranchName
  let failed = false
  if (branchName === branchDefault) {
    return true
  }
  return async (dispatch, getState) => {
    dispatch(startGetContents({ branchName: branchName }))
    await dispatch(changeBranch({ branchName: branchName, write: false }))

    var editorContents = await fs.promises.readFile(repoDirectory + '/' + ZRCodePath, { encoding: 'utf8' }, (err, data) => { if (err) throw err }).then((success) => {
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
  }
}

export function updateBranches (payload) {
  const message = payload.message
  const unlock = payload.unlock
  return async function (dispatch, getState) {
    dispatch(startBranchListUpdate({ message: message }))
    console.log('test1')
    await git.getRemoteInfo({ url: getState().repoSelect.repoUrl, corsProxy: proxyUrl }).then(
      output => {
        console.log('test2')
        console.log(recursiveObjectPrinter(output))
        const branches = Object.keys(output.refs.heads)
        const branchesFiltered = branches.filter(word => word !== 'HEAD')
        dispatch(branchListUpdateSuccess({ branchList: branchesFiltered, message: message, unlock: unlock }))
        console.log(`branchList updated to ${branchesFiltered}`)
        return output
      }, error => {
        console.log(`updateBranches failed with error ${error}`)
        dispatch(branchListUpdateFailure())
        throw error
      }
    )
  }
}

export function createBranch (payload) {
  return async function (dispatch, getState) {
    const branchName = payload.name
    console.log(`Creating new branch ${branchName}`)
    // ADD: Update branches and check that new branch has unique name
    await dispatch(updateBranches({ message: false, unlock: false }))
    if (branchName === '' || getState().branches.branchList.includes(branchName)) {
      dispatch(branchCreationFailure({ reset: false, nameError: true }))
      throw new Error('Failed to create branch because branchName was invalid or already existed')
    }
    const oldBranch = getState().branches.currentBranch
    console.log('createBranch thunk started')
    dispatch(startBranchCreation({ branchName: branchName }))
    console.log('startBranchCreation dispatched')
    await git.branch({ dir: repoDirectory, ref: branchName, checkout: true }).then(
      (success) => {
        return success
      }, async function (error) {
        console.log(`creation failed with error ${error}`)
        await dispatch(changeBranch({ branchName: oldBranch, write: true }))
        dispatch(branchCreationFailure({ branchName: branchName, reset: true, nameError: false }))
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
      dispatch(branchCreationFailure({ reset: false, nameError: false }))
      throw error
    })
    const logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log(recursiveObjectPrinter(logOutput))
  }
}
