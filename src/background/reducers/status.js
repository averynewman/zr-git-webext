import {
  statusDefault, SET_USER_INFO, MERGE_STARTING, MERGE_STARTED, MERGE_RESOLVING, MERGE_RESOLVED, MERGE_ABORTED, MERGE_FAILURE, MERGE_RESOLVE_FAILURE,
  STATUS_SET_MESSAGE, STATUS_LOCK, STATUS_UNLOCK
} from '../../constants'

var defaultSubstate = {
  locked: false,
  statusMessage: statusDefault,
  merging: false
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case STATUS_LOCK:
      output.locked = true
      break
    case STATUS_UNLOCK:
      output.locked = false
      break
    case STATUS_SET_MESSAGE:
      output.statusMessage = action.message
      break

    case SET_USER_INFO:
      output.statusMessage = 'User info successfully updated.'
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
