import React from 'react';
import ValidForm from './ValidForm';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import api from '../util/api';
import { LoggedInOnly } from './auth-conditional';
import querystring from 'querystring';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {networkError: false};
  }

  findError(field, value) {
    switch(field) {
      case 'email':
        return value ? false : 'Please enter your email address';
      case 'password':
        return value ? false : 'Please enter your password';
    }
  }

  async handleSubmit(values) {
    try {
      let res = await api.post('/login', values);

      if(res.status < 500) {
        let body = await res.json();
        if(res.ok)
          this.props.login(body);
        else // 401
          return body.errors;
      } else { // server error
        this.setState({
          networkError: 'Apologies, a server error occurred - please try again'
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        networkError: 'Failed to login - please check your internet connection'
      });
    }
  }

  render() {
    return (
      <div id="login" className="container-narrow">
        <h1>Login</h1>

        <ValidForm
          onSubmit={this.handleSubmit}
          findError={this.findError}
          buttonText="Login"
          fields={[
            {type: 'email', name: 'email', label: "Email"},
            {type: 'password', name: 'password', label: "Password"}
          ]}
        />

        {!!this.state.networkError &&
          <div className="error-msg">{this.state.networkError}</div>}

        <LoggedInOnly>
          <Redirect to={querystring.parse(this.props.location.search.substring(1)).then || '/'}/>
        </LoggedInOnly>
      </div>
    )
  }
}

import { login } from '../actions';

export default connect(null, {login})(Login);
