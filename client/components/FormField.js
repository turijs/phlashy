import React from 'react';


class FormField extends React.Component {

  render() {
    let {type, name, value, label, placeHolder, error} = this.props;

    return (
      <div>
        {label &&
          <label htmlFor="name">{label}</label>}
        <input
          value={value || undefined}
          type={type}
          name={name}
          className={error ? 'error' : null}
          placeholder={placeHolder}
        />
        {error &&
          <div className="error-msg">{error}</div>}
      </div>
    )
  }
}

export default FormField;
