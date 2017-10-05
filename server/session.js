const session = require('express-session');
var store;

if(process.env.NODE_ENV == 'production') {
  const RedisStore = require('connect-redis')(session);

  store = new RedisStore({
    url: process.env.REDIS_URL
  });
} else {
  store = new session.MemoryStore();
}

module.exports = session({
  store,
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: false
})
