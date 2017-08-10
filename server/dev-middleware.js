const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../webpack.config.js');
// modify entry to include hot middleware client
config.entry.unshift('webpack-hot-middleware/client?reload=true'); 
// add plugins to config
config.plugins = [ new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin() ];

// config.devtool = 'cheap-module-eval-source-map';

const compiler = webpack(config);


module.exports = [
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true },
    noInfo: true
  }),
  webpackHotMiddleware(compiler)
];
