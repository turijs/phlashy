module.exports = {
  nickname(val) {
    return val.length <= 50;
  },

  email(val) {
    if(val.length > 254) return false;
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val)
  },

  password(val) {
    return val.length >= 6;
  }
}
