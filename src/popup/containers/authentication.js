import React from 'react'
import { connect } from 'react-redux'

import { setUserInfo, deleteUserInfo } from '../action-creators/authentication'
import { recursiveObjectPrinter } from '../index'

class Authentication extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputs: { username: '', email: '', token: '' }, inputActive: false }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleStartInput = this.handleStartInput.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleStartInput () {
    this.setState({ inputActive: true })
  }

  handleSubmit (event) {
    this.props.setUserInfo({ name: this.state.inputs.name, email: this.state.inputs.email, token: this.state.inputs.token })
    this.setState({ inputActive: false, inputs: { name: '', email: '', token: '' } })
    event.preventDefault()
  }

  handleDelete () {
    this.props.deleteUserInfo()
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({ inputs: { [name]: value } })
  }

  render () {
    if (this.state.inputActive === false) {
      return (
        <div>
          <button className='set-user-info' onClick={this.handleStartInput} disabled={this.props.locked}>
            Set User Info
          </button>
          <button className='delete-user-info' onClick={this.handleDelete} disabled={this.props.locked}>
            Delete User Info
          </button>
          <p>{`User info is currently ${recursiveObjectPrinter(this.props.userInfo)}`}</p>
        </div>
      )
    } else {
      return (
        <div>
          <form onSubmit={this.handleSubmit} autoComplete='off'>
            <label>
              Name:<br />
              <input name='name' type='text' onChange={this.handleInputChange} value={this.state.inputs.name} disabled={this.props.locked} /><br />
            </label>
            <label>
              Email:<br />
              <input name='email' type='text' onChange={this.handleInputChange} value={this.state.inputs.email} disabled={this.props.locked} /><br />
            </label>
            <label>
              Token:<br />
              <input name='token' type='text' onChange={this.handleInputChange} value={this.state.inputs.token} disabled={this.props.locked} /><br />
            </label>
            <input type='submit' value='Submit User Info' disabled={this.props.locked} />
          </form>
          <button className='delete-user-info' onClick={this.handleDelete} disabled={this.props.locked}>
            Delete User Info
          </button>
          <p>{`User info is currently ${recursiveObjectPrinter(this.props.userInfo)}`}</p>
        </div>
      )
    }
  }
}

export default connect(
  state => ({
    userInfo: state.authentication,
    locked: state.status.locked
  }),
  { setUserInfo, deleteUserInfo }
)(Authentication)
