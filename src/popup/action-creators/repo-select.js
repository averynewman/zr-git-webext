import { CHANGE_REPO } from '../../constants'

export function changeRepo (payload) {
  console.log('Popup changeRepo triggered with payload')
  console.log(payload)
  return {
    type: CHANGE_REPO,
    ...payload
  }
}
