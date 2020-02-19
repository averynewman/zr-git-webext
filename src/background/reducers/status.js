import {
  START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, START_REPO_CHANGE, REPO_CHANGE_SUCCESS, REPO_CHANGE_FAILURE,
  START_COMMIT_PUSH, COMMIT_PUSH_SUCCESS, COMMIT_PUSH_FAILURE, START_FETCH_REPLACE, FETCH_REPLACE_SUCCESS, FETCH_REPLACE_FAILURE, statusDefault, START_BRANCH_CREATION,
  BRANCH_CREATION_SUCCESS, BRANCH_CREATION_FAILURE, MERGE_STARTING, MERGE_STARTED, MERGE_RESOLVING, MERGE_RESOLVED, MERGE_ABORTED, MERGE_FAILURE, MERGE_RESOLVE_FAILURE
} from '../../constants'

var defaultSubstate = {
  locked: false,
  statusMessage: statusDefault,
  merging: false
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case START_REPO_CHANGE:
      output.locked = true
      output.statusMessage = 'Changing repos...'
      break
    case REPO_CHANGE_SUCCESS:
      output.statusMessage = 'Successfully changed repos.'
      break
    case REPO_CHANGE_FAILURE:
      output.locked = false
      output.statusMessage = 'Failed to change repo, check your path and try again.'
      break
    case START_BRANCH_LIST_UPDATE:
      output.locked = true
      if (action.manual) {
        output.statusMessage = 'Updating branch list...'
      }
      break
    case BRANCH_LIST_UPDATE_SUCCESS:
      output.locked = false
      if (action.manual) {
        output.statusMessage = 'Successfully updated branch list.'
      }
      break
    case START_BRANCH_CHANGE:
      output.locked = true
      output.statusMessage = 'Switching branches...'
      break
    case BRANCH_CHANGE_SUCCESS:
      output.locked = false
      output.statusMessage = 'Successfully switched branches.'
      break
    case START_BRANCH_CREATION:
      output.locked = true
      output.statusMessage = `Creating branch ${action.branchName}...`
      break
    case BRANCH_CREATION_SUCCESS:
      output.locked = false
      output.statusMessage = 'Successfully created new branch.'
      break
    case BRANCH_CREATION_FAILURE:
      output.locked = false
      output.statusMessage = 'Failed to create branch.'
      break
    case START_FETCH_REPLACE:
      output.locked = true
      output.statusMessage = 'Fetching and replacing...'
      break
    case FETCH_REPLACE_SUCCESS:
      output.locked = false
      output.statusMessage = 'Successfully fetched and replaced.'
      break
    case FETCH_REPLACE_FAILURE:
      output.locked = false
      output.statusMessage = 'Failed to fetch and replace.'
      break
    case START_COMMIT_PUSH:
      output.locked = true
      output.statusMessage = 'Committing and pushing...'
      break
    case COMMIT_PUSH_SUCCESS:
      output.locked = false
      output.statusMessage = 'Successfully committed and pushed.'
      break
    case COMMIT_PUSH_FAILURE:
      output.locked = false
      output.statusMessage = 'Failed to commit and push.'
      break
    case MERGE_STARTING:
      output.statusMessage = 'Processing merge data...'
      output.mergeStoredCommitMessage = action.message
      output.mergeStoredEditorContents = action.editorContents
      break
    case MERGE_STARTED:
      output.merging = true
      break
    case MERGE_RESOLVING:
      output.statusMessage = 'Merge resolving...'
      break
    case MERGE_RESOLVED:
      output.merging = false
      output.statusMessage = 'Merge and commit successful.'
      output.mergeStoredCommitMessage = undefined
      output.mergeStoredEditorContents = undefined
      break
    case MERGE_ABORTED:
      output.merging = false
      output.statusMessage = 'Merge aborted.'
      output.mergeStoredCommitMessage = undefined
      output.mergeStoredEditorContents = undefined
      output.locked = false
      break
    case MERGE_FAILURE:
      output.merging = false
      output.statusMessage = 'Merge failed.'
      output.mergeStoredCommitMessage = undefined
      output.mergeStoredEditorContents = undefined
      output.locked = false
      break
    case MERGE_RESOLVE_FAILURE:
      output.statusMessage = 'Merge failed to resolve. Please ensure that all conflict markers are removed and try again.'
      break
  }
  return output
}
