import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import { changeBranch, reloadBranches } from '../action-creators/branches'

class BranchSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedBranch: '' }
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.reloadBranches = this.reloadBranches.bind(this)
  }

  handleBranchChange () {
    let newBranch = this.state.selectedBranch
    console.log(`dispatching branch change to branch ${newBranch}`)
    this.props.dispatch(changeBranch(newBranch))
  }

  reloadBranches () {
    console.log('reloading branches')
    this.props.dispatch(reloadBranches())
  }

  render () {
    let selectOptions = []
    for (let i = 0; i < this.props.branchList.length; i++) {
      selectOptions.push({ value: this.props.branchList[i], label: this.props.branchList[i] })
    }
    if (this.props.repoUrl === 'default') {
      return (
        null
      )
    }
    return (
      <div>
        <h1>{ this.props.updating ? 'Updating branches...' : (this.props.switching ? 'Switching branch...' : `Current branch is ${this.props.currentBranch}`) }</h1>
        <Select defaultValue={{ value: 'master', label: 'master' }} isClearable isSearchable options={selectOptions} onChange={this.handleBranchChange} />
        <button className='change-repo' onClick={this.reloadBranches}>
          Reload Branches
        </button>
      </div>
    )
  }
}

export default connect(
  state => ({
    currentBranch: state.branches.currentBranch,
    branchList: state.branches.branchList,
    switching: state.branches.switching,
    updating: state.branches.updating,
    repoUrl: state.repoSelect.repoUrl
  }),
  null
)(BranchSelect)
