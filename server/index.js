require('dotenv').config();

const path = require('path');
const querystring = require('querystring');
const express = require('express');
const sessionMiddleware = require('./session');
const exphbs = require('express-handlebars');

const db = require('./db');
const api = require('./api');
const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;
const publicRoutes = [
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

// make production status available in views etc.
app.locals.prod = process.env.NODE_ENV == 'production';

// DEV environment only
if(!app.locals.prod) {
  app.use( require('./dev/middleware') );
}

app.use('/static', express.static( path.resolve(__dirname, '../client/dist') ));

app.use(sessionMiddleware);

// api route
app.use('/api', api);

// login checkpoint
app.get('*', (req, res, next) => {
  if( auth.loggedIn(req) )
    next();
  else if(publicRoutes.includes(req.path))
    res.render('main');
  else
    res.redirect('/login?then=' + querystring.escape(req.path));
}, auth.loadUserID);

// preload user details
app.get('*', (req, res, next) => {
  db.getUser(req.userID).then(user => {
    req.preloadedData = { user };
    next();
  }).catch(e => next(e));
});

// preload specific deck details
app.get('/decks/:id-:name', (req, res, next) => {
  db.getDeckBasic(req.userID, req.params.id).then(deck => {
    req.preloadedData.decks = {[deck.id]: deck};
    next();
  }).catch(e => {
    res.redirect('/decks');
  });
});

// final response for logged in users
app.get('*', (req, res) => {
  res.render('main', {
    preloaded: JSON.stringify(req.preloadedData).replace(/</g, '\\u003c'),
  });
});





// Start listening for requests
// ============================
db.setupTablesIfNecessary().then(() => {
  // db.createCard(1, 7, 'one', 'uno').then(res => console.log(res))
  app.listen(port, () => console.log(`listening on port ${ port }`) );
}).catch(err => console.log(err));
