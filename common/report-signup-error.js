const validate = require('./validate');

function findSignupError(field, value) {
  switch(field) {
    case 'nickname':
      if ( validate.nickname(value) ) return false;
      else return 'Nicknames must be 50 characters or less';
    case 'email':
      if(!value)
        return 'This field is required';
      else if ( ! validate.email(value) )
        return `'${value}' doesn't look like a valid email address...`;
      else
        return false;
    case 'password':
      if(!value)
        return 'This field is required';
      else if ( ! validate.password(value) )
        return 'Please enter at least 6 characters';
      else
        return false;
    default: return false;
  }
}

module.exports = findSignupError;
