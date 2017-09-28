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
      let res = await api.post('/user', values);

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
      this.setState({
        networkError: 'Failed to login - please check your internet connection'
      });
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
