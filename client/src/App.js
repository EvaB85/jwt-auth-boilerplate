import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import {UserProfile} from './UserProfile';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      //ADDED COMMA & lockedResult
      user: null,
      lockedResult: ''
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
    this.LiftTokenToState = this.LiftTokenToState.bind(this)
    //ADDED
    this.handleClick = this.handleClick.bind(this)
  }

  LiftTokenToState(data) {
    this.setState({
      //contains both token and user
      token: data.token,
      user: data.user
    })
  }

//ADDED ALL
handleClick(e) {
  e.preventDefault()
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.token
  axios.get('/locked/test').then(result => {
    this.setState({
      lockedResult: result.data
    })
  })
}

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('mernToken');
    // Remove the user info from the state
    this.setState({
      token: '',
      user: null
    })
  }

  checkForLocalToken() {
    // Look in local storage for the Token
    let token = localStorage.getItem('mernToken')
    //ADDED/edited#########
    if(!token || token === 'undefined') {
      // There was no Token
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // We did find a token in localStorage
      // Sent it to the back to be verified (validated)--axios call, import it first
      axios.post('/auth/me/from/token', {
        token
      }).then( foo => {
        // Put the token in localStorage
        localStorage.setItem('mernToken', foo.data.token)
        this.setState({
          token: foo.data.token,
          user: foo.data.user
        })
      }).catch( err => console.log(err) )
    }
  }

  componentDidMount() {
    this.checkForLocalToken()
}

  render() {
    let user = this.state.user
    if(user) {
      return (
        <div className="App">
          <UserProfile user={user} logout={this.logout} />
          {/* ADDED two lines below */}
          <a onClick={this.handleClick}>Test the protected route</a>
          <p>{this.state.lockedResult}</p>
        </div>
      );
    }else {
      return(
        <div className='App'>
          <Signup liftToken={this.LiftTokenToState} />
          <Login liftToken={this.LiftTokenToState} />
        </div>
      )
    }
  }
}
//CHECK THE OBOVE ) } MAKE SURE NUMB OF THEM

export default App;
