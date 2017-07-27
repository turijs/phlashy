const db = require('./db');

module.exports = {
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
    if(this.loggedIn(req))
      next();
    else
      res.sendStatus(401);
  },
}


// passport.use(new LocalStrategy(
//   {
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
//   },
//   function(req, email, pw, done) {
//     if(req.createNewUser) {
//
//     }
//     db.authUser(email, pw).then(user => {
//       if(user)
//         done(null, user);
//       else
//         done(null, false, {message: 'Incorrect password'});
//     }).catch(err => {
//       if(err == 'not found')
//         done(null, false, {message: 'Email is not registered'});
//       else
//         done(err);
//     })
//   }
// ));
//
// passport.serializeUser((user, done) => {
//   done(null, JSON.stringify(user));
// });
//
// passport.deserializeUser((userJSON, done) => {
//   done(null, JSON.parse(userJSON));
// });
