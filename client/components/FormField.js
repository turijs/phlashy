import React from 'react';


class FormField extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {showError: true};
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.error)
      this.setState({showError: true});
  }

  handleChange() {
    this.setState({showError: false});
  }

  render() {
    let {type, name, label, error, onBlur} = this.props;
    // error becomes false if there is no actual error to show
    error = this.state.showError && error;

    return (
      <div>
        <label htmlFor="name">{label}</label>
        <input
          type={type}
          name={name}
          onBlur={onBlur}
          onChange={this.handleChange}
          className={error ? 'error' : ''}
        />
        {error &&
          <div className="error-msg">{error}</div>
        }
      </div>
    )
  }
}

export default FormField;
