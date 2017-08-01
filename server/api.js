const bodyParser = require('body-parser');

const api = require('express').Router();
const db = require('./db');
const auth = require('./auth');


api.use(bodyParser.json());

// logging
api.use((req, _, next) => next( console.log(req.body) ));


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


// Create a new user
api.post('/user', (req, res) => {
  let {nickname, email, password} = req.body;

  // if(!validator.isEmail(email))
  //   res.status(400).send('Invalid email');

  if(!password || password.length < 6)
    res.status(400).send('Password too short');

  db.createUser(nickname, email, password)
    .then(user => {
      res.status(201).send(user);
      req.session.userID = id;
    })
    .catch(err => {
      if(err.code == '23505')
        res.status(400).send('Email already taken')
      else {
        console.log(err);
        res.sendStatus(500);
      }
    });
});

// Everything below this point is protected access
api.use(auth.rejectUnauthorized);

// Update a user
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



api.post('/decks', (req, res) => {

});

api.put('/decks/:id', (req, res) => {

});

api.get('/decks', (req, res) => {

});

api.delete('/decks/:id', (req, res) => {

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
