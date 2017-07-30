export default {
  nickname(val) {
    return val ? false : 'This field is required';
  },

  email(val) {
    if(!val)
      return 'This field is required';
    if( ! /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val) )
      return `'${val}' doesn't look like a valid email address...`;
    return false;
  },

  password(val) {
    if(!val)
      return 'This field is required';
    if(val.length < 6)
      return 'Please enter at least 6 characters';
    return false;
  }
}
