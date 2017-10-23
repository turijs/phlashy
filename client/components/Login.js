import React from 'react';
import ValidForm from './ValidForm';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import api, {toJSON} from '../util/api';
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
      let userData = await api.post('/login', values).then(toJSON);
      this.props.login(userData);
    } catch (e) {
      switch(e.status) {
        case 401: return (await e.json()).errors;
        case 500: return {_general: 'Apologies, a server error occurred - please try again later'}
        case 0: return {_general: 'Failed to login - please check your internet connection'}
        default: console.log(e);
      }
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

        <LoggedInOnly>
          <Redirect to={querystring.parse(this.props.location.search.substring(1)).then || '/'}/>
        </LoggedInOnly>
      </div>
    )
  }
}

import { login } from '../actions';

export default connect(null, {login})(Login);
