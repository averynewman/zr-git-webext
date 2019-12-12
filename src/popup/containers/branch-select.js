import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import { changeBranch, reloadBranches } from '../action-creators/branches'
import { repoDefault, branchDefault } from '../../constants'

class BranchSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedBranch: '', input: '' }
    this.handleBranchChange = this.handleBranchChange.bind(this)
    this.handleBranchReload = this.handleBranchReload.bind(this)
  }

  handleBranchChange (option) {
    const branchName = option.value
    this.setState({ selectedBranch: branchName })
    const repoUrl = this.props.repoUrl
    // console.log(`dispatching branch change to branch ${branchName}`)
    this.props.changeBranch({ branchName: branchName, repoUrl: repoUrl })
  }

  handleBranchReload () {
    // console.log('reloading branches')
    this.props.reloadBranches({ manual: true })
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
      </div>
    )
  }
}

export default connect(
  state => ({
    locked: state.status.locked,
    currentBranch: state.branches.currentBranch,
    branchList: state.branches.branchList,
    switching: state.branches.switching,
    repoUrl: state.repoSelect.repoUrl,
    validRepo: state.repoSelect.validRepo
  }),
  {
    changeBranch,
    reloadBranches
  }
)(BranchSelect)
