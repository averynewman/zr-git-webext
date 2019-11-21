import { combineReducers } from 'redux'

import repoSelect from './repo-select'
import branches from './branches'
import authentication from './authentication'

export default combineReducers({ repoSelect, branches, authentication })
