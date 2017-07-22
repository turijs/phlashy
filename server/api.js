const api = require('express').Router();
const bodyParser = require('body-parser');
const db = require('./db');
const validator = require('validator');

api.use(bodyParser.json());

// logging
api.use((req, res, next) => {
  console.log(req.body);
  next();
})

api.post('/login', (req, res) => {

});

// Create a new user
api.post('/users', (req, res) => {
  let {nickname, email, password} = req.body;

  if(!validator.isEmail(email))
    res.status(400).send('Invalid email');

  if(!password || password.length < 5)
    res.status(400).send('Password too short');

  db.createUser(nickname, email, password)
    .then(id => {
      res.status(201).send({id});
    })
    .catch(err => {
      if(err.code == '23505')
        res.status(400).send('Email already taken')
      else {
        console.log(err);
        res.status(500).send();
      }
    });
});

// Update a user
api.put('/users', async (req, res) => {
  let {oldPassword, newPassword, nickname} = req.body;
  let userID = 1;

  if(newPassword) {
    if(!oldPassword)
      response.status(400).send('Missing current password');

    let allowed = await db.authUser(userID, oldPassword);


  }
  if(newPassword.length < 5)
    res.status(400).send('Password too short');
});

api.get('/users/:id', (req, res) => {

});

api.delete('/users/:id', (req, res) => {

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
