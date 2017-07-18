require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const db = require('./db');

db.setupTablesIfNecessary()
  .then(res => {
    // console.log(res);
    return db.createUser('ian', 'ian@ian', '123456');
    // return db.authUser(1, '123450');
  })
  .then(res => console.log(res))
  .catch(err => {
    console.log(err);
  });



app.get('/', (req, res) => {
  res.send('\n\nHello, world!\n\n');
});

app.listen(port, () => {
  console.log(`listening on port ${ port }`);
});
