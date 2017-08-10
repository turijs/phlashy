import React from 'react';
import FormField from './FormField';
import { connect } from 'react-redux';
import api from '../util/api';
import findSignupError from '../../common/report-signup-error';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      values: {
        nickname: '',
        email: '',
        password: ''
      },
      errors: {
        email: false,
        password: false
      },
      isLoading: false,
      communicationError: false
    }
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState(prevState => ({
      values: { ...prevState.values, [name]: value },
    }));
    if(name in this.state.errors)
      this.setState(prevState => ({
        errors: { ...prevState.errors, [name]: false },
      }));
  }

  handleBlur(e) {
    let {name, value} = e.target;
    if(name in this.state.errors)
      this.setState(prevState => ({
        errors: { ...prevState.errors, [name]: findError(name, value) },
      }));
  }

  async handleSubmit(e) {
    e.preventDefault();

    // validate all fields
    let errors = {};
    for(let field in this.state.errors)
      errors[field] = findSignupError(field, this.state.values[field]);

    // go ahead with the request if there are no errors
    if( !errors.email && !errors.password ) {
      this.setState({isLoading: true});

      let res = await api.post('/user', this.state.values);
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
      <div id="signup">
        <h1>Sign Up</h1>

        <form noValidate onSubmit={this.handleSubmit} onChange={this.handleChange} >
          <FormField
            type="text"
            name="nickname"
            label="Nickname (optional)"
          />
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
          <button type="submit">Create Account</button>
          {isLoading && <span>loading</span>}
        </form>
      </div>
    )
  }
}

function matchDispatchToProps(dispatch) {
  return {
    login: user => dispatch({type: 'LOGIN', ...user})
  }
}

export default connect(null, matchDispatchToProps)(Signup);
