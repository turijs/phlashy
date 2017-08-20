import React from 'react';
import FormField from './FormField';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import api from '../util/api';
import { LoggedInOnly } from './auth-conditional';
import { login } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      values: {
        email: '',
        password: ''
      },
      errors: {
        email: '',
        password: ''
      },
      isLoading: false,
      communicationError: false
    }
  }

  findError(field, value) {
    switch(field) {
      case 'email':
        return value ? false : 'Please enter your email address';
      case 'password':
        return value ? false : 'Please enter your password';
    }
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState(prevState => ({
      values: { ...prevState.values, [name]: value },
      errors: { ...prevState.errors, [name]: false }
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();

    // validate all fields
    let errors = {};
    for(let field in this.state.errors)
      errors[field] = this.findError(field, this.state.values[field]);

    // go ahead with the request if there are no errors
    if( !errors.email && !errors.password ) {
      this.setState({isLoading: true});

      let res = await api.post('/login', this.state.values);
      let json = await res.json();

      if(res.ok)
        return this.props.login(json);
      else if(res.status == 401)
        errors = {...errors, ...json.errors};
      else
        this.setState({ communicationError: true });

      this.setState({isLoading: false});
    }

    this.setState({errors});
  }

  render() {
    let {errors, isLoading} = this.state;

    return (
      <div id="login" className="container-narrow">
        <LoggedInOnly><Redirect to="/" /></LoggedInOnly>

        <h1>Login</h1>

        <form noValidate onSubmit={this.handleSubmit} onChange={this.handleChange} >
          <FormField
            type="email"
            name="email"
            label="Email"
            error={errors.email}
          />
          <FormField
            type="password"
            name="password"
            label="Password"
            error={errors.password}
          />
          <button type="submit">Login</button>
          {isLoading && <span>loading</span>}
        </form>
      </div>
    )
  }
}

function matchDispatchToProps(dispatch) {
  return {
    login: userData => dispatch( login(userData) )
  }
}

export default connect(null, matchDispatchToProps)(Login);
