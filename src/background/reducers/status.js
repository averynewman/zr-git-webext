import {
  START_BRANCH_LIST_UPDATE, BRANCH_LIST_UPDATE_SUCCESS, START_BRANCH_CHANGE, BRANCH_CHANGE_SUCCESS, START_REPO_CHANGE, REPO_CHANGE_SUCCESS, REPO_CHANGE_FAILURE,
  START_COMMIT_PUSH, COMMIT_PUSH_SUCCESS, COMMIT_PUSH_FAILURE, START_FETCH_REPLACE, FETCH_REPLACE_SUCCESS, FETCH_REPLACE_FAILURE, statusDefault, START_BRANCH_CREATION, BRANCH_CREATION_SUCCESS, BRANCH_CREATION_FAILURE, START_GET_CONTENTS, GET_CONTENTS_SUCCESS, GET_CONTENTS_FAILURE
} from '../../constants'

var defaultSubstate = {
  locked: false,
  statusMessage: statusDefault
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
      if (action.message) {
        output.statusMessage = 'Updating branch list...'
      }
      break
    case BRANCH_LIST_UPDATE_SUCCESS:
      if (action.unlock) {
        output.locked = false
      }
      if (action.message) {
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
    case START_GET_CONTENTS:
      output.locked = true
      output.statusMessage = `Retrieving the contents of ${action.branchName}`
      break
    case GET_CONTENTS_SUCCESS:
      output.locked = false
      output.statusMessage = `Successfully retrieved contents and switched back to ${action.branchName}`
      break
    case GET_CONTENTS_FAILURE:
      output.locked = false
      output.statusMessage = `Failed to retrieve contents; switched back to ${action.branchName}`
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
      if (action.nameError) {
        output.statusMessage = 'That branch name is invalid or already exists, please choose another name and try again.'
      } else {
        output.statusMessage = 'Failed to create branch.'
      }
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
  }
  return output
}
