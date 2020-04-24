import {
  MERGE_STARTING, MERGE_STARTED, MERGE_RESOLVED, MERGE_ABORTED, MERGE_FAILURE, MERGE_RESOLVE_FAILURE
} from '../../constants'

var defaultSubstate = {
  merging: false,
  mergeStoredCommitMessage: undefined,
  mergeStoredEditorContents: undefined
}

export default (state = defaultSubstate, action) => {
  const output = state
  switch (action.type) {
    case MERGE_STARTING:
      output.mergeStoredCommitMessage = action.commitMessage
      output.mergeStoredEditorContents = action.editorContents
      break
    case MERGE_STARTED:
      output.merging = true
      break
    case MERGE_RESOLVED:
      output.merging = false
      output.mergeStoredCommitMessage = undefined
      output.mergeStoredEditorContents = undefined
      break
    case MERGE_ABORTED:
      output.merging = false
      output.mergeStoredCommitMessage = undefined
      output.mergeStoredEditorContents = undefined
      output.locked = false
      break
    case MERGE_FAILURE:
      output.merging = false
      output.mergeStoredCommitMessage = undefined
      output.mergeStoredEditorContents = undefined
      output.locked = false
      break
  }
  return output
}
