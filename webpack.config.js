const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './client/index.js'],
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
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
              'transform-async-functions',
              // 'transform-regenerator',
            ]
            // plugins: [require('babel-plugin-transform-object-rest-spread')]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)/,
        use: {
          loader: 'file-loader',
          options: {

          }
        }
      }
    ]
  }
}
