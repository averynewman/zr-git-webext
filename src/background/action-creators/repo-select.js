import { CHANGE_REPO } from '../../constants'

export function changeRepo (payload) {
  console.log('Background changeRepo triggered with payload')
  console.log(payload)
  return {
    type: CHANGE_REPO,
    ...payload
  }
}
