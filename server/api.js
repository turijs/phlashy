const bodyParser = require('body-parser');

const api = require('express').Router();
const db = require('./db');
const auth = require('./auth');
const findSignupError = require('../common/report-signup-error');


api.use(bodyParser.json());

// logging
api.use((req, _, next) => next( console.log(req.body) ));

/*
 * Login
 */
api.post('/login', (req, res) => {
  let {email, password} = req.body;

  db.authUser(email, password).then(user => {
    if(user) {
      auth.login(req, user);
      res.status(200).send(user);
    }
    else
      res.status(401).send({
        errors: {password: 'Incorrect password'}
      });
  }).catch(err => {
    if(err == 'not found')
      res.status(401).send({
        errors: {email: `'${email}' is not registered`}
      });
    else
      console.log(err), res.sendStatus(500);
  });
});

/*
 * Create a new user
 */
api.post('/user', (req, res) => {
  let {nickname, email, password} = req.body;

  // initial check for errors
  let errors = {
    email: findSignupError('email', email),
    password: findSignupError('password', password)
  }
  if(errors.email || errors.password) {
    res.status(401).send(errors);
    return;
  }

  db.createUser(nickname, email, password)
    .then(user => {
      auth.login(req, user);
      res.status(201).send(user);
    })
    .catch(err => {
      if(err.code == '23505')
        res.status(401).send({
          errors: {email: `'${email}' is already associated with an account`}
        })
      else {
        console.log(err);
        res.sendStatus(500);
      }
    });
});

//////////////////////////////////////////////////
// Everything below this point is protected access
api.use(auth.rejectUnauthorized);
// Load current user ID in to req.userID
api.use(auth.loadUserID);
//////////////////////////////////////////////////

/*
 * Logout
 */
api.post('/logout', (req, res) => {
  auth.logout(req);
  res.sendStatus(200);
});

/*
 * Update user details
 */
api.put('/user', async (req, res) => {
  let {oldPassword, newPassword, nickname} = req.body;
  let userID = req.session.userID;

  if(newPassword) {
    if(!oldPassword)
      response.status(400).send('Missing current password');

    let allowed = await db.authUser(userID, oldPassword);


  }
  if(newPassword.length < 6)
    res.status(400).send('Password too short');
});

api.delete('/user', (req, res) => {

});


/*
 * Create a new deck
 */
api.post('/decks', async (req, res) => {
  let {name, description} = req.body;
  try {
    let deck = await db.createDeck(req.userID, name, description);
    res.status(201).send(deck);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

api.put('/decks/:id', (req, res) => {

});

/*
 * Get a list of all decks
 */
api.get('/decks', async (req, res) => {
  try {
    let decks = await db.getDecks(req.userID);
    res.status(200).send(decks);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

});

api.delete('/decks/:id', async (req, res) => {
  try {
    await db.deleteDeck(req.userID, req.params.id);
    res.sendStatus(200)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});



api.post('/cards', (req, res) => {

});

api.put('/cards/:id', (req, res) => {

});

api.get('/cards', (req, res) => {

});

api.delete('/cards/:id', (req, res) => {

});




module.exports = api;
