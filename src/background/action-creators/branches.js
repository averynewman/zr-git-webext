import {
  BRANCH_LIST_UPDATE_SUCCESS, BRANCH_LIST_UPDATE_FAILURE, START_BRANCH_CHANGE, BRANCH_CHANGE_FAILURE, repoDirectory, BRANCH_CREATION_FAILURE, START_BRANCH_CREATION,
  proxyUrl, branchDefault, ZRCodePath, recursiveObjectPrinter
} from '../../constants'
import { statusLock, statusUnlock, statusSetMessage } from './status'
import { fs } from '../index'
import { changeRepo } from './repo-select'
import * as git from 'isomorphic-git'
import { writeDoc } from './fetch-replace'

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

function branchChangeFailure (payload) {
  return {
    type: BRANCH_CHANGE_FAILURE,
    ...payload
  }
}

function startBranchCreation (payload) {
  return {
    type: START_BRANCH_CREATION,
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
    throw new Error('Failed to switch branches because branchName was branchDefault')
  }
  console.log(`switching to branch ${branchName}`)
  return async function (dispatch, getState) {
    dispatch(startBranchChange({ branchName: branchName }))
    dispatch(statusLock())
    dispatch(statusSetMessage({ message: 'Switching branches...' }))
    await dispatch(updateBranches({ message: false, unlock: false }))
    // console.log('changeBranch thunk started')
    await git.fetch({ dir: repoDirectory, ref: branchName, depth: 5, url: getState().repoUrl }).then(
      (success) => {
        return success
      }, error => {
        console.log(`fetch failed with error ${error}`)
        dispatch(branchChangeFailure())
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to switch branches. Check internet your connection and try again.' }))
        throw error
      }
    )
    return git.checkout({ dir: repoDirectory, ref: branchName }).then(
      async function (success) {
        if (write) {
          await dispatch(writeDoc()).then(
            (success) => {
              dispatch(statusUnlock())
              dispatch(statusSetMessage({ message: 'Successfully switched branches.' }))
            }, error => {
              dispatch(branchChangeFailure())
              dispatch(statusUnlock())
              dispatch(statusSetMessage({ message: 'Failed to switch branches. Check that there is an open ZR IDE tab.' }))
              throw error
            }
          )
        }
        return success
      }, error => {
        console.log(`checkout failed with error ${error}`)
        dispatch(branchChangeFailure())
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to switch branches. Check your internet connection and try again.' }))
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
    dispatch(statusLock())
    dispatch(statusSetMessage({ message: `Retrieving the contents of ${branchName}` }))
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
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: `Successfully retrieved contents and switched back to ${oldBranchName}` }))
      return editorContents
    } else {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: `Failed to retrieve contents and switched back to ${branchName}` }))
      return null
    }
  }
}

export function updateBranches (payload) {
  const message = payload.message
  const unlock = payload.unlock
  return async function (dispatch, getState) {
    dispatch(statusLock())
    if (message) {
      dispatch(statusSetMessage({ message: 'Updating branch list...' }))
    }
    console.log('test1')
    await git.getRemoteInfo({ url: getState().repoSelect.repoUrl, corsProxy: proxyUrl }).then(
      output => {
        console.log('test2')
        console.log(recursiveObjectPrinter(output))
        const branches = Object.keys(output.refs.heads)
        const branchesFiltered = branches.filter(word => word !== 'HEAD')
        dispatch(branchListUpdateSuccess({ branchList: branchesFiltered, message: message, unlock: unlock }))
        if (message) {
          dispatch(statusSetMessage({ message: 'Successfully updated branch list.' }))
        }
        if (unlock) {
          dispatch(statusUnlock())
        }
        console.log(`branchList updated to ${branchesFiltered}`)
        return output
      }, error => {
        console.log(`updateBranches failed with error ${error}`)
        dispatch(branchListUpdateFailure())
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to update branch list' }))
        throw error
      }
    )
  }
}

export function createBranch (payload) {
  return async function (dispatch, getState) {
    const branchName = payload.name
    const oldBranch = getState().branches.currentBranch
    console.log(`Creating new branch ${branchName}`)
    dispatch(statusLock())
    await dispatch(updateBranches({ message: false, unlock: false }))
    if (branchName === '' || getState().branches.branchList.includes(branchName)) {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'That branch name is invalid or already exists, please choose another name and try again.' }))
      throw new Error('Failed to create branch because branchName was invalid or already existed')
    }
    if (oldBranch === branchDefault) {
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'No branch is currently selected, please select a branch and try again.' }))
      throw new Error('Failed to create branch because oldBranch was branchDefault')
    }
    console.log('createBranch thunk started')
    dispatch(startBranchCreation({ branchName: branchName }))
    dispatch(statusSetMessage({ message: `Creating branch ${branchName}...` }))
    console.log('startBranchCreation dispatched')
    await git.branch({ dir: repoDirectory, ref: branchName, checkout: true }).then(
      (success) => {
        return success
      }, async function (error) {
        console.log(`creation failed with error ${error}`)
        dispatch(branchCreationFailure({ branchName: branchName }))
        await dispatch(changeBranch({ branchName: oldBranch, write: true }))
        dispatch(statusUnlock())
        dispatch(statusSetMessage({ message: 'Failed to create branch.' }))
        throw error
      }
    )
    await git.push({
      dir: repoDirectory,
      noGitSuffix: true,
      ref: getState().branches.currentBranch,
      remote: 'origin',
      token: getState().userInfo.token,
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
      dispatch(statusUnlock())
      dispatch(statusSetMessage({ message: 'Successfully created branch. ' }))
      return success
    }, async function (error) {
      console.log(`push failed with error ${error}. fetching now`)
      await dispatch(changeRepo({ repoUrl: getState().repoSelect.repoUrl }))
      await dispatch(changeBranch({ branchName: oldBranch, write: true }))
      dispatch(statusSetMessage({ message: 'Failed to create branch.' }))
      throw error
    })
    const logOutput = await git.log({ dir: repoDirectory, depth: 2, ref: getState().branches.currentBranch })
    console.log(recursiveObjectPrinter(logOutput))
  }
}
