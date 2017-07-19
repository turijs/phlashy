require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const db = require('./db');
const api = require('./api');


app.use('/static', express.static( path.resolve(__dirname, '../client/dist') ));

app.use('/api', api);


app.get('/', (req, res) => {
  res.send('\n\nHello, world!\n\n');
});



// Start listening for requests
// ============================
db.setupTablesIfNecessary()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${ port }`);
    });
  })
  .catch(err => { console.log(err); });
