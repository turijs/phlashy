const bodyParser = require('body-parser');

const api = require('express').Router();
const db = require('./db');
const auth = require('./auth');
const findSignupError = require('../common/report-signup-error');

/*
 * Test connection
 */
api.head('/ping', (req, res) => {
  res.clearCookie('connect.sid');
  res.removeHeader('Set-Cookie');
  res.sendStatus(200);
});

// Parse request body
api.use(bodyParser.json());

// logging
api.use((req, _, next) => next( console.log('Req Body:', req.body) ));

/*
 * Login
 */
api.post('/login', (req, res, next) => {
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
  }).catch(e => {
    if(e == 'NOT_FOUND')
      res.status(401).send({
        errors: {email: `'${email}' is not registered`}
      });
    else next(e);
  });
});

/*
 * Create a new user
 */
api.post('/user', (req, res, next) => {
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
      else next(err);
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
api.put('/user', async (req, res, next) => {
  // FIXME: this method is incomplete
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
api.post('/decks', async (req, res, next) => {
  let {name, description, created} = req.body;
  created = maybeDate(created);
  try {
    let deck = await db.createDeck(req.userID, name, description, created);
    res.status(201).send(deck);
  } catch(e) { next(e) }
});

api.put('/decks/:id', async (req, res, next) => {
  let {name, description, modified} = req.body;
  modified = maybeDate(modified);
  try {
    let deck = await db.updateDeck(req.userID, req.params.id, name, description, modified);
    res.send(deck);
  } catch(e) {
    if(e == 'NOT_FOUND') res.send('No such deck');
    else next(e);
  }
});

/*
 * Get a list of all decks
 */
api.get('/decks', async (req, res, next) => {
  try {
    let decks = await db.getDecks(req.userID);
    res.send(decks);
  } catch(e) { next(e) }
});

/*
 * Delete a deck
 */
api.delete('/decks/:id', async (req, res, next) => {
  try {
    await db.deleteDeck(req.userID, req.params.id);
    res.sendStatus(200);
  } catch (e) { next(e) }
});

//////////////////////////////////////////////
//                Cards
//////////////////////////////////////////////


/*
 * Create a new card
 */
api.post('/cards', async (req, res, next) => {
  let {front, back, deckId, created} = req.body;
  created = maybeDate(created);
  try {
    let card = await db.createCard(req.userID, deckId, front, back, created);
    res.status(201).send(card);
  } catch(e) { next(e) }
});

api.put('/cards/:id', async (req, res, next) => {
  let {front, back, modified} = req.body;
  modified = maybeDate(modified);
  try {
    let card = await db.updateCard(req.userID, req.params.id, front, back, modified);
    res.send(card);
  } catch(e) {
    if(e == 'NOT_FOUND') res.send('No such card');
    else next(e);
  }
});

api.get('/cards', async (req, res, next) => {
  try {
    let cards = await db.getCards(req.userID);
    res.send(cards);
  } catch(e) { next(e) }
});

api.delete('/cards/:id', async (req, res, next) => {
  let when = maybeDate(req.query.when);
  console.log(when);
  try {
    await db.deleteCard(req.userID, req.params.id, when);
    res.sendStatus(200);
  } catch (e) { next(e) }
});

/*==== Error Handling ====*/
api.use((e, req, res, next) => {
  console.log(e);
  res.sendStatus(500);
});

module.exports = api;

/*==== Helper Functions ====*/
function maybeDate(d) {
  if(d) {
    if( !(d instanceof Date) )
      d = new Date(d);

    if( !isNaN(d) )
      return d;
  }
  return undefined;
}
