import React from 'react'
import { connect } from 'react-redux'
import { startCommit } from '../action-creators/fetch-commit'
import { branchDefault } from '../../constants'

class CommitButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputActive: false, inputs: { message: '' } }
    this.handleCommit = this.handleCommit.bind(this)
    this.handleStartInput = this.handleStartInput.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleStartInput () {
    this.setState({ inputActive: true })
  }

  handleCommit (event) {
    this.props.startCommit({ commitMessage: this.state.inputs.message })
    this.setState({ inputActive: false, inputs: { message: '' } })
    event.preventDefault()
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState((state) => {
      const output = state
      output.inputs[name] = value
      return output
    })
  }

  render () {
    if (this.props.currentBranch === branchDefault) {
      return (null)
    } else if (this.state.inputActive === false) {
      return (
        <div>
          <button className='commit-push' onClick={this.handleStartInput} disabled={this.props.locked}>
            Commit changes
          </button>
        </div>
      )
    } else {
      return (
        <form onSubmit={this.handleCommit} autoComplete='off'>
          <label>
            Commit message:<br />
            <input name='message' type='text' onChange={this.handleInputChange} value={this.state.inputs.message} disabled={this.props.locked} />
          </label>
          <input type='submit' value='Commit and push' disabled={(this.props.locked || this.state.inputs.message === '')} />
        </form>
      )
    }
  }
}

export default connect(
  state => ({
    currentBranch: state.branches.currentBranch,
    locked: state.status.locked
  }),
  { startCommit }
)(CommitButton)
