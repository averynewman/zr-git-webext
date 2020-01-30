import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import { changeBranch, reloadBranches, createBranch } from '../action-creators/branches'
import { repoDefault, branchDefault } from '../../constants'

class BranchSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedBranch: '', inputs: { branchName: '' } }
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.handleBranchReload = this.handleBranchReload.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleBranchCreation = this.handleBranchCreation.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleBranchChange (option) {
    const branchName = option.value
    this.setState({ selectedBranch: branchName })
    // console.log(`dispatching branch change to branch ${branchName}`)
    this.props.changeBranch({ branchName: branchName, write: true })
  }

  handleBranchReload () {
    // console.log('reloading branches')
    this.props.reloadBranches({ manual: true })
  }

  handleBranchCreation (event) {
    // console.log(`dispatching create branch with name ${this.state.inputs.branchName}`)
    this.props.createBranch({ name: this.state.inputs.branchName })
    this.setState({ inputs: { branchName: '' } })
    event.preventDefault()
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ inputs: { [name]: value } })
  }

  handleKeyPress (event) {
    if (event.keyCode === 13 /* Enter */) {
      event.preventDefault()
    }
  }

  render () {
    const selectOptions = []
    for (let i = 0; i < this.props.branchList.length; i++) {
      selectOptions.push({ value: this.props.branchList[i], label: this.props.branchList[i] })
    }
    if (this.props.repoUrl === repoDefault || this.props.validRepo === false) {
      return (
        null
      )
    }
    return (
      <div>
        {/* <h3>{(this.props.switching ? null : (this.props.currentBranch === branchDefault ? 'No branch selected yet' : `Current branch is ${this.props.currentBranch}`))}</h3> */}
        <p>Branch:</p>
        <Select
          value={(this.props.currentBranch === branchDefault ? undefined : { value: this.props.currentBranch, label: this.props.currentBranch })}
          isClearable isSearchable options={selectOptions}
          onChange={this.handleBranchChange}
          isDisabled={this.props.locked}
        />
        <button className='change-repo' onClick={this.handleBranchReload} disabled={this.props.locked}>
          Reload Branches
        </button>

        <form onKeyPress={this.handleKeyPress} onSubmit={this.handleBranchCreation}>
          <label>
            Enter new branch name:<br />
            <input type='text' name='branchName' onChange={this.handleInputChange} value={this.state.inputs.branchName} disabled={this.props.locked} /><br />
          </label>
          <input type='submit' value='Create new branch' disabled={this.props.locked} />
        </form>

      </div>
    )
  }
}

export default connect(
  state => ({
    locked: state.status.locked,
    currentBranch: state.branches.currentBranch,
    branchList: state.branches.branchList,
    repoUrl: state.repoSelect.repoUrl,
    validRepo: state.repoSelect.validRepo
  }),
  {
    changeBranch,
    reloadBranches,
    createBranch
  }
)(BranchSelect)
