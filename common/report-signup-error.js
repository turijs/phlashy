const validate = require('./validate');

function findSignupError(field, value) {
  switch(field) {
    case 'email':
      if(!value)
        return 'This field is required';
      else if ( ! validate.email(value) )
        return `'${val}' doesn't look like a valid email address...`;
      else
        return false;
    case 'password':
      if(!value)
        return 'This field is required';
      else if ( ! validate.password(value) )
        return 'Please enter at least 6 characters';
      else
        return false;
  }
}

module.exports = findSignupError;
