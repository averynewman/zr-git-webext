import React from 'react'
import { connect } from 'react-redux'
import * as git from 'isomorphic-git'

import { startClone, cloneFailure, cloneSuccess } from '../action-creators/repo-select'

class RepoSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { input: '' }
    this.handleRepoChange = this.unboundHandleRepoChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleRepoChange = this.handleRepoChange.bind(this)
  }

  handleKeyPress (event) {
    if (event.keyCode === 13) {
      this.handleRepoChange()
    }
  }

  handleCloneSuccess (path) {
    return (fulfillment) => { this.props.cloneSuccess({ repoUrl: ('https://github.com/' + path + '.git') }) }
  }

  handleCloneFailure (fulfillment) {
    return this.props.cloneFailure()
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyPress) // document.getElementById('').addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyPress) // document.getElementById('').removeEventListener('keydown', this.handleKeyPress)
  }

  async handleRepoChange () {
    let repoPath = this.state.input
    this.setState({ input: '' })
    this.props.startClone()
    git.clone({
      dir: '/',
      corsProxy: 'https://cors.isomorphic-git.org',
      url: ('https://github.com/' + repoPath + '.git')
    }).then(this.handleCloneSuccess(repoPath), this.handleCloneFailure)
  }

  updateInput (input) {
    this.setState({ input })
  }

  render () {
    return (
      <div>
        <input
          onChange={e => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className='change-repo' onClick={this.handleRepoChange}>
          Change Repo
        </button>
      </div>
    )
  }
}

export default connect(
  null,
  { startClone, cloneFailure, cloneSuccess }
)(RepoSelect)
