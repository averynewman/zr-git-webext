import remote from './remote'

const initialState = []
const testRemote = {
  name: 'octocat',
  url: 'https://github.com/octocat/Hello-World.git',
  credential: '000000000000000000000000000'
}

describe('empty remote list', () => {
  test('initial state with empty action type', () => {
    expect(remote(undefined, {})).toEqual(initialState)
  })

  test('add a remote', () => {
    expect(remote(undefined, {
      type: 'ADD_REMOTE',
      remote: testRemote
    }))
    .toEqual([testRemote])
  })
})

describe('remote list with 1 remote already', () => {
  const stateWithRemote = remote(undefined, {
    type: 'ADD_REMOTE',
    remote: testRemote
  })
  
  test('remove a remote', () => {
    expect(remote(stateWithRemote, {
      type: 'REMOVE_REMOTE',
      name: testRemote.name
    })).toEqual(initialState)
  })

  test('rename a remote', () => {
    expect(remote(stateWithRemote, {
      type: 'RENAME_REMOTE',
      oldName: testRemote.name,
      newName: 'lolol_ha-ha?'
    })).toEqual([Object.assign({}, testRemote, {name: 'lolol_ha-ha?'})])
  })
})
