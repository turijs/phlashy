require('dotenv').config();

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

// turn off X-Powered-By header
app.disable('x-powered-by');

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

// api route
app.use('/api', api);

// send main page
app.get('*', (req, res) => {
  if( auth.loggedIn(req) ) {
    auth.loadUserID(req);
    db.getUser(req.userID).then(user => {
      res.render('main', {user: JSON.stringify(user)});
    }).catch(e => console.log(e));
  } else {
    if(unprotectedRoutes.includes(req.path))
      res.render('main');
    else
      res.redirect('/login');
  }
});





// Start listening for requests
// ============================
db.setupTablesIfNecessary()
  .then(() => {
    // db.createCard(1, 2, 'front', 'back').catch(e => console.log(e));
    // db.getDecks(1).then(decks => console.log(decks));
    app.listen(port, () => console.log(`listening on port ${ port }`) );
  })
  .catch(err => { console.log(err); });
