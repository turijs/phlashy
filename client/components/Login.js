import React from 'react';
import FormField from './FormField';
import { connect } from 'react-redux';
import api from '../util/api';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {

      email: {
        value: '',
        error: ''
      },
      password: {
        value: '',
        error: ''
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

  updateField(field, fieldProps) {
    this.setState(prevState => ({
      [field]: {
        ...prevState[field],
        ...fieldProps
      }
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    let email = this.state.email.value,
        password = this.state.password.value;

    // validate all fields
    let errors = {
      email: this.findError('email', email),
      password: this.findError('password', password)
    }

    // go ahead with the request if there are no errors
    if( !errors.email && !errors.password ) {
      this.setState({isLoading: true});

      let res = await api.login({email, password})
      let json = await res.json();
      if(res.ok)
        this.props.login(json);
      else if(res.status == 401)
        errors = json.errors;
      else
        this.setState({ communicationError: true });



      this.setState({isLoading: false});
    }

    for(let field in errors)
      this.updateField(field, {error: errors[field]});
  }

  handleBlur(e) {
    let {name: field, value} = e.target;
    this.updateField(field, {value, error: false});
  }

  render() {
    let {email, password, isLoading} = this.state;

    return (
      <form onSubmit={this.handleSubmit} noValidate >
        <FormField
          type="email"
          name="email"
          label="Email"
          error={email.error}
          onBlur={this.handleBlur}
        />
        <FormField
          type="password"
          name="password"
          label="Password"
          error={password.error}
          onBlur={this.handleBlur}
        />
        <button type="submit">Login</button>
        {isLoading && <span>loading</span>}
      </form>
    )
  }
}

function matchDispatchToProps(dispatch) {
  return {
    login: user => dispatch({type: 'LOGIN', ...user})
  }
}

export default connect(null, matchDispatchToProps)(Login);
