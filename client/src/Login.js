import React, {Component} from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      //ADDED comma & next line
      password: '',
      response: null
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  }
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
  }
  handleSubmit(e) {
    //submit form page refreshes so we will prevent default
    e.preventDefault()
    //generate a new post that we have in the backend
    axios.post('/auth/login', {
      email: this.state.email,
      password: this.state.password
    }).then( result => {
      //ADDED##########
      if (result.data.hasOwnProperty('error')) {
        //The response we got was an console.error
        this.setState({
          response: result.data
        })
      } else {
        //assuming everything went well,no errors, proceed to .then
        localStorage.setItem('mernToken', result.data.token)
        this.props.liftToken(result.data)
        //ADDED/EDIT...remove .catch below
        this.setState({
          response: null
        })
      }
    })
  }

render() {
  return (
    //ADDED/edited
    <div>
      <p>{(this.state.response) ? this.state.response.message : ''}</p>
      <form onSubmit={this.handleSubmit}>
        Email: <input type='email' value={this.state.email} onChange={this.handleEmailChange} /><br></br>
        Password: <input type='password' value={this.state.password} onChange={this.handlePasswordChange} /><br></br>
        <input type ='submit' value='Log In!' />
      </form>
    </div>
    )
  }
}

export default Login;
