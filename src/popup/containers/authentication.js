import React from 'react'
import { connect } from 'react-redux'

import { setUserInfo } from '../action-creators/authentication'
import { nameDefault } from '../../constants'

class Authentication extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputs: { name: '', email: '', token: '' }, inputActive: false }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleStartInput = this.handleStartInput.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleStartInput () {
    this.setState({ inputActive: true })
  }

  handleSubmit (event) {
    if (this.state.inputs.name !== '' && this.state.inputs.token !== '' && this.state.inputs.email !== '') {
      this.props.setUserInfo({ name: this.state.inputs.name, email: this.state.inputs.email, token: this.state.inputs.token })
    }
    this.setState({ inputActive: false })
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
    if (this.state.inputActive === false) {
      return (
        <div>
          <button className='set-user-info' onClick={this.handleStartInput} disabled={this.props.locked}>
            Set User Info
          </button>
          {(this.props.userInfo.name === nameDefault ? '\tNo user data' : `\tCurrent user: ${this.props.userInfo.name}`)}
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
  { setUserInfo }
)(Authentication)
