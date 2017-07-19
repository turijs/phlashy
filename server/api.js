const api = require('express').Router();
const bodyParser = require('body-parser');
const db = require('./db');
const validator = require('validator');

api.use(bodyParser.json());

api.post('/create-user', function(req, res) {
  console.log(req.body);
  let {nickname, email, password} = req.body;

  if(!validator.isEmail(email))
    res.status(400).send({error: 'Invalid email'});

  if(!password || password.length < 5)
    res.status(400).send({error: 'Password too short'});

  db.createUser(nickname, email, password)
    .then(id => {
      res.status(201).send({id});
    })
    .catch(err => {
      if(err.code == '23505')
        res.status(400).send({error: 'Email already taken'})
      else {
        console.log(err);
        res.status(500).send();
      }
    });
});



module.exports = api;
