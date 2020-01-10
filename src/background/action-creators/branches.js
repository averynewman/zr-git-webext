import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, repoDirectory, BRANCH_CREATION_SUCCESS, BRANCH_CREATION_FAILURE, START_BRANCH_CREATION, proxyUrl, branchDefault } from '../../constants'
import { recursiveObjectPrinter } from '../index'
import { changeRepo } from './repo-select'
import * as git from 'isomorphic-git'
import { writeDoc } from './fetch-replace';

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
  if (branchName === branchDefault) {
    return true
  }
  console.log(`switching to branch ${branchName}`)
  return async function (dispatch, getState) {
    dispatch(startBranchChange({ branchName: branchName }))
    // console.log('changeBranch thunk started')
    await git.fetch({ dir: repoDirectory, ref: branchName, depth: 5, corsProxy: 'https://cors.isomorphic-git.org', url: getState().repoUrl }).then(
      (success) => {
        return success
      }, error => {
        console.log(`fetch failed with error ${error}`)
        throw error
      }
    )
    return git.checkout({ dir: repoDirectory, ref: branchName }).then(
      async function (success) {
        await dispatch(writeDoc())
        dispatch(branchChangeSuccess({ branchName: branchName }))
        return success
      }, error => {
        console.log(`checkout failed with error ${error}`)
        throw error
      }
    )
  }
}

export function updateBranches (payload) {
  const manual = payload.manual
  return async function (dispatch, getState) {
    dispatch(startBranchListUpdate({ manual: manual }))
    return git.listBranches({ dir: repoDirectory, remote: 'origin' }).then(
      async branches => {
        const branchesUpdated = branches.filter(word => word !== 'HEAD')
        dispatch(branchListUpdateSuccess({ branchList: branchesUpdated, manual: manual }))
        console.log(`branchList updated to ${branchesUpdated}`)
        return branches
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
        await dispatch(changeBranch({ branchName: oldBranch }))
        throw error
      }
    )
    await git.push({
      dir: repoDirectory,
      noGitSuffix: true,
      ref: getState().branches.currentBranch,
      remote: 'origin',
      corsProxy: proxyUrl,
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
      await dispatch(changeBranch({ branchName: oldBranch }))
      dispatch(branchCreationFailure({ reset: false }))
      throw error
    })
    let logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log(recursiveObjectPrinter(logOutput))
  }
}
