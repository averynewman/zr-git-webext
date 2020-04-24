import { combineReducers } from 'redux'

import repoSelect from './repo-select'
import branches from './branches'
import userInfo from './user-info'
import status from './status'
import merge from './merge'

export default combineReducers({ repoSelect, branches, status, userInfo, merge })
