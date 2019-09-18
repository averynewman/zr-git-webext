import React from 'react'
import { connect } from 'react-redux'

import { changeRepo } from '../action-creators/repo-select'

class RepoSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { input: '' }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleRepoChange = this.handleRepoChange.bind(this)
  }

  handleKeyPress (event) {
    if (event.keyCode === 13) {
      this.handleRepoChange()
    }
  }

  /* componentDidMount () {
    document.addEventListener('keydown', this.handleKeyPress) // document.getElementById('').addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyPress) // document.getElementById('').removeEventListener('keydown', this.handleKeyPress)
  } */

  handleRepoChange () { // Possible race condition with multiple changeRepo dispatches before the previous one finishes in background?
    let repoPath = this.state.input
    this.setState({ input: '' })
    console.log(`dispatching repo change request in popup with path ${repoPath}`)
    this.props.changeRepo(repoPath)
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
          onKeyDown={e => this.handleKeyPress(e)}
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
  { changeRepo }
)(RepoSelect)
