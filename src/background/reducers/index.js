import { combineReducers } from 'redux'

import repoSelect from './repo-select'
import branches from './branches'
import authentication from './authentication'
import status from './status'

export default combineReducers({ repoSelect, branches, authentication, status })
