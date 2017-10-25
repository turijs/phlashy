const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.dev-config.js');
const compiler = webpack(config);


module.exports = [
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true },
    noInfo: true
  }),
  webpackHotMiddleware(compiler)
];
