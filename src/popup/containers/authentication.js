import React from 'react'
import { connect } from 'react-redux'

import { setUserInfo, deleteUserInfo } from '../action-creators/authentication'
import { recursiveObjectPrinter } from '../../background/index'

class Authentication extends React.Component {
  constructor (props) {
    super(props)
    this.state = { input: { username: '', email: '', token: '' }, inputActive: false }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.startInput = this.startInput.bind(this)
  }

  handleKeyPress (event) {
    if (event.keyCode === 13) {
      this.submitUserInfo()
    }
  }

  startInput () {
    this.setState({ inputActive: true })
  }

  handleSubmit () {
    console.log('???')
    this.props.setUserInfo({ name: this.state.input.name, email: this.state.input.email, token: this.state.input.token })
    console.log(`setting user info to ${recursiveObjectPrinter({ name: this.state.input.name, email: this.state.input.email, token: this.state.input.token })}`)
    this.setState({ inputActive: false, input: { name: '', email: '', token: '' } })
  }

  handleDelete () {
    this.props.deleteUserInfo()
  }

  updateInput (input, key) {
    this.setState((state, props) => {
      const output = state
      output.input[key] = input
      return output
    })
  }

  render () {
    if (this.state.inputActive === false) {
      return (
        <div>
          <button className='set-user-info' onClick={this.startInput}>
            Set User Info
          </button>
          <button className='delete-user-info' onClick={this.handleDelete}>
            Delete User Info
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type='text' onChange={e => this.updateInput(e.target.value, 'name')} value={this.state.input.name} />
            </label>
            <label>
              Email:
              <input type='text' onChange={e => this.updateInput(e.target.value, 'email')} value={this.state.input.email} />
            </label>
            <label>
              Token:
              <input type='text' onChange={e => this.updateInput(e.target.value, 'token')} value={this.state.input.token} />
            </label>
            <input type='submit' value='Submit User Info' />
          </form>
          <button className='delete-user-info' onClick={this.handleDelete}>
            Delete User Info
          </button>
          <p>{`User info is currently ${recursiveObjectPrinter(this.props.userInfo)}`}</p>
        </div>
      )
    }
  }
}

export default connect(
  state => ({ userInfo: state.authentication }),
  { setUserInfo, deleteUserInfo }
)(Authentication)
