module.exports = {
  email(val) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val)
  },

  password(val) {
    return val.length >= 6;
  }
}
