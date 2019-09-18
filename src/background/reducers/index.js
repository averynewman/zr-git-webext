import { combineReducers } from 'redux'

import repoSelect from './repo-select'
import branches from './branches'

export default combineReducers({ repoSelect, branches })
