import React from 'react';
import LabelledField from './LabelledField';
import AsyncButton from './AsyncButton';

class ValidForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    let values = {}, errors = {};

    props.fields.forEach(field => {
      values[field.name] = '';
      errors[field.name] = false;
    });

    this.state = {values, errors, isLoading: false}
  }

  // component may be unmounted before final call to setState
  // in handleSubmit. Change setState below to a no-op so this
  // can play out harmlessly.
  componentWillUnmount() {
    this.setState = () => void 0;
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState(state => ({
      values: { ...state.values, [name]: value },
      errors: { ...state.errors, [name]: false }
    }));
  }

  handleBlur(e) {
    if(!this.props.showErrorOnBlur) return;

    let {name, value} = e.target;

    this.setState(state => ({
      errors: { ...state.errors, [name]: this.props.findError(name, value) }
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();

    let {state, props} = this;

    // validate all fields
    let errors = {};
    for(let field in state.errors)
      errors[field] = props.findError(field, state.values[field]);

    // if there are errors, show them and exit
    if( Object.values(errors).some(err => err) )
      return this.setState({errors});

    this.setState({isLoading: true});

    let externalErrors = await this.props.onSubmit(state.values);

    this.setState({isLoading: false});

    if(externalErrors)
      this.setState({
        errors: {...errors, ...externalErrors}
      });


  }

  render() {
    let {fields, buttonText = 'Submit', buttonClass} = this.props;
    let {errors, isLoading} = this.state;

    return (
      <form
        noValidate
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onSubmit={this.handleSubmit}
      >
        {fields.map(field => (
          <LabelledField
            key={field.name}
            type={field.type}
            name={field.name}
            label={field.label}
            error={errors[field.name]}
          />
        ))}

        <AsyncButton className={buttonClass} type="submit" loading={isLoading}>
          {buttonText}
        </AsyncButton>
      </form>
    );
  }
}

export default ValidForm;
