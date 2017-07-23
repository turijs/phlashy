const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('./db');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, pw, done) {
    if(req.createNewUser) {
      
    }
    db.authUser(email, pw).then(user => {
      if(user)
        done(null, user);
      else
        done(null, false, {message: 'Incorrect password'});
    }).catch(err => {
      if(err == 'not found')
        done(null, false, {message: 'Email is not registered'});
      else
        done(err);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((userJSON, done) => {
  done(null, JSON.parse(userJSON));
});
