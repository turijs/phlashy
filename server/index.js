require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const db = require('./db');
const api = require('./api');


app.use(express.session());


app.use('/api', api);

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config.js');
  // modify entry to include hot middleware client
  config.entry = [ 'webpack-hot-middleware/client?reload=true', './client/index.js' ];
  // add plugins to config
  config.plugins = [ new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin() ];


  const compiler = webpack(config);

  console.log(config.output.publicPath);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use('/static', express.static( path.resolve(__dirname, '../client/dist') ));



// Start listening for requests
// ============================
db.setupTablesIfNecessary()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${ port }`);
    });
  })
  .catch(err => { console.log(err); });
