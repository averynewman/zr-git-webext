import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import { changeBranch } from '../action-creators/branches'

class BranchSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedBranch: '' }
    this.handleBranchChange = this.handleBranchChange.bind(this)
  }

  handleBranchChange () {
    let newBranch = this.state.selectedBranch
    console.log(`dispatching branch change to branch ${newBranch}`)
    this.props.changeBranch(newBranch)
  }

  render () {
    if (this.props.repoUrl === 'default') {
      return (
        null
      )
    }
    if (this.props.cloning === true) {
      return (
        <div>
          <h3>Cloning new repo...</h3>
        </div>
      )
    }
    return (
      <div>
        <h3>{ this.props.updating ? 'Updating branches...' : (this.props.switching ? 'Switching branch...' : 'Select a branch') }</h3>
        <Select isClearable isSearchable options={this.props.branchOptions} onChange={this.handleBranchChange} />
      </div>
    )
  }
}

export default connect(
  state => ({
    currentBranch: state.branches.currentBranch,
    branchOptions: state.branches.branchList,
    switching: state.branches.switching,
    updating: state.branches.updating,
    repoUrl: state.repoSelect.repoUrl,
    cloning: state.repoSelect.cloning
  }),
  { changeBranch }
)(BranchSelect)
