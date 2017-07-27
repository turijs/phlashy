require('dotenv').config();
console.log(process.env.NODE_ENV);

const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const db = require('./db');
const api = require('./api');
const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;
const unprotectedRoutes = [
  '/', '/login', '/about'
];

// Configure templating
app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: false
}));
app.set('view engine', '.hbs');


// DEV environment only
if(process.env.NODE_ENV !== 'production') {
  app.use( require('./dev-middleware') );
}

app.use('/static', express.static( path.resolve(__dirname, '../client/dist') ));

app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.get('*', (req, res) => {
  if( auth.loggedIn(req) ) {
    res.render('main', {test: `User ID: ${id}`});
  } else {
    if(unprotectedRoutes.includes(req.path))
      res.render('main', {test: 'Not logged in'});
    else
      res.redirect('/login');
  }
});


// api route
app.use('/api', api);




// Start listening for requests
// ============================
db.setupTablesIfNecessary()
  .then(() => {
    app.listen(port, () => console.log(`listening on port ${ port }`) );
  })
  .catch(err => { console.log(err); });
