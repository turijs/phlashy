const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    'babel-polyfill',
    './client/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                'targets': { 'browsers': '> 1%' }
              }],
              'react'
            ],
            plugins: [
              'transform-object-rest-spread',
              'transform-class-properties'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'resolve-url-loader',  'sass-loader?sourceMap', ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)/,
        use: {
          loader: 'file-loader',
          options: { name: '[name]-[hash:6].[ext]' }
        }
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: '/images/',
            name: '[name]-[hash:6].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
}
