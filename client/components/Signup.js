import React from 'react';
import { connect } from 'react-redux';
import api from '../util/api';
import findSignupError from '../../common/report-signup-error';
import { login } from '../actions';
import ValidForm from './ValidForm';


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { networkError: false };
  }

  async handleSubmit(values) {
    try {
      let userData = await api.post('/user', values).then(toJSON);
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
      <div id="signup" className="container-narrow">
        <h1>Sign Up</h1>

        <ValidForm
          onSubmit={this.handleSubmit}
          findError={findSignupError}
          buttonText="Create Account"
          buttonClass="btn-go"
          fields={[
            {type: 'text', name: 'nickname', label: 'Nickname (optional)'},
            {type: 'email', name: 'email', label: 'Email'},
            {type: 'password', name: 'password', label: 'Password'}
          ]}
          showErrorOnBlur
        />

        {!!this.state.networkError &&
          <div className="error-msg">{this.state.networkError}</div>}
      </div>
    )
  }
}

function matchDispatchToProps(dispatch) {
  return {
    login: userData => dispatch( login(userData) )
  }
}

export default connect(null, matchDispatchToProps)(Signup);
