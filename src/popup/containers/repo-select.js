import React from 'react'
import { connect } from 'react-redux'

import { changeRepo } from '../action-creators/repo-select'
import { repoDefault } from '../../constants'

class RepoSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputs: { repoUrl: '' } }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleRepoChange = this.handleRepoChange.bind(this)
  }

  handleRepoChange (event) {
    const repoUrl = this.state.inputs.repoUrl
    this.setState({ inputs: { repoUrl: '' } })
    this.props.changeRepo({ repoUrl: `https://github.com/${repoUrl}.git` }) // change this to implement switching to non-github repositories
    event.preventDefault()
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ inputs: { [name]: value } })
  }

  render () {
    return (
      <div>
        <p>{
          ((repoUrl, validRepo) => {
            if (repoUrl === repoDefault) {
              return 'No repo currently selected.'
            } else if (validRepo === false) {
              return 'placeholder'
            } else {
              return (`Active repo: ${repoUrl}`)
            }
          })(this.props.repoUrl, this.props.validRepo)
        }
        </p>
        <form onSubmit={this.handleRepoChange} autoComplete='off'>
          <label>
            <input name='repoUrl' type='text' onChange={this.handleInputChange} value={this.state.inputs.repoUrl} disabled={this.props.locked} />
          </label>
          <input type='submit' value='Change Repo' disabled={this.props.locked} />
        </form>
      </div>
    )
  }
}

export default connect(
  state => ({
    locked: state.status.locked,
    repoUrl: state.repoSelect.repoUrl,
    validRepo: state.repoSelect.validRepo
  }),
  { changeRepo }
)(RepoSelect)
