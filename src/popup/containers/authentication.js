import React from 'react'
import { connect } from 'react-redux'

import { setUserInfo, deleteUserInfo } from '../action-creators/authentication'

class Authentication extends React.Component {
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

  handleRepoChange () { // Possible race condition with multiple changeRepo dispatches before the previous one finishes in background?
    const repoUrl = this.state.input
    this.setState({ input: '' })
    // console.log(`dispatching repo change request in popup with path ${repoPath}`)
    this.props.changeRepo({ repoUrl: `https://github.com/${repoUrl}.git` }) // change this when switching to non-github repositories
  }

  updateInput (input) {
    this.setState({ input })
  }

  render () {
    return (
      <div>
        <p>{
          ((cloning, repoUrl, validRepo, erasing) => {
            if (erasing === true) {
              return 'Clearing filesystem...'
            } else if (cloning === true) {
              return 'Cloning new repo...'
            } else if (validRepo === false) {
              return 'Clone failed. Check your path and try again.'
            } else if (repoUrl === repoDefault) {
              return 'No repo selected yet.'
            } else {
              return (`Active repo: ${repoUrl}`)
            }
          })(this.props.cloning, this.props.repoUrl, this.props.validRepo, this.props.erasing)
        }
        </p>
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
