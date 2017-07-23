require('dotenv').config();
console.log(process.env.NODE_ENV);

const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
// const passport = require('passport');

const db = require('./db');
const api = require('./api');

const app = express();
const port = process.env.PORT || 3000;

// Configure templating
app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: false
}));
app.set('view engine', '.hbs');


app.get('/', (_, res) => {
  res.render('main', {test: 'poop'});
});

// DEV environment only
if(process.env.NODE_ENV !== 'production') {
  app.use( require('./dev-middleware') );
}


// passport setup
// require('./auth');

app.use('/static', express.static( path.resolve(__dirname, '../client/dist') ));
app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true
}));
// app.use(passport.initialize());
// app.use(passport.session());
// api route
app.use('/api', api);

app.use((req, res, next) => {

})



// Start listening for requests
// ============================
db.setupTablesIfNecessary()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${ port }`);
    });
  })
  .catch(err => { console.log(err); });
