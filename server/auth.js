const db = require('./db');

const auth = {
  login(req, user) {
    req.session.userID = user.id;
  },

  logout(req) {
    req.session.destroy(err => console.log(err));
  },

  loggedIn(req) {
    return !!req.session.userID; // works because ID can never be 0
  },

  rejectUnauthorized(req, res, next) {
    if(auth.loggedIn(req))
      next();
    else
      res.sendStatus(401);
  },

  loadUserID(req, res, next) {
    req.userID = req.session.userID;
    if(next) next();
  }
}

module.exports = auth;
