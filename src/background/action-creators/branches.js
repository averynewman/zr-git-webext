import { START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, repoDirectory } from '../../constants'
import * as git from 'isomorphic-git'

function startBranchListUpdate (payload) {
  console.log(`starting branch list update`)
  return {
    type: START_BRANCH_LIST_UPDATE,
    payload
  }
}

function branchListUpdateSuccess (payload) {
  console.log(`successfully updated branch list to ${payload.branchList}`)
  return {
    type: BRANCH_LIST_UPDATE_SUCCESS,
    payload
  }
}

function startBranchChange (payload) {
  console.log(`starting change to branch ${payload.branchName}`)
  return {
    type: START_BRANCH_CHANGE,
    payload
  }
}

function branchChangeSuccess (payload) {
  console.log(`successfully changed to branch ${payload.branchName}`)
  return {
    type: BRANCH_CHANGE_SUCCESS,
    payload
  }
}

export function changeBranch (payload) {
  const branchName = payload.payload.branchName
  console.log(`changeBranch request received to branch ${branchName}`)
  return async function (dispatch) {
    console.log('changeBranch thunk started')
    dispatch(startBranchChange({ branchName: branchName }))
    console.log('startBranchChange dispatched')
    return git.fetch({ dir: repoDirectory, ref: branchName, depth: 2, corsProxy: 'https://cors.isomorphic-git.org', url: payload.payload.repoUrl }).then(
      () => {
        dispatch(branchChangeSuccess({ branchName: branchName }))
      }, error => {
        console.log(`branchChange failed with error ${error}`)
        throw error
      }
    )
  }
}

export async function updateBranches (dispatch) {
  dispatch(startBranchListUpdate())
  return git.listBranches({ dir: repoDirectory, remote: 'origin' }).then(
    async branches => {
      let branchesUpdated = branches.filter(word => word !== 'HEAD')
      dispatch(branchListUpdateSuccess({ branchList: branchesUpdated }))
      console.log(`branchList updated to ${branchesUpdated}`)
      return branches
    }, error => {
      console.log(`updateBranches failed with error ${error}`)
      throw error
    }
  )
}

export function updateBranchesThunk (payload) {
  console.log('updateBranchesThunk called')
  return updateBranches
}
