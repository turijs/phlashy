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
              // 'transform-async-functions',
              // 'transform-regenerator',
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
        use: [ 'style-loader', 'css-loader', 'resolve-url-loader',  'sass-loader?sourceMap',  ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)/,
        use: {
          loader: 'file-loader',
          options: { name: '[name]-[hash:6].[ext]' }
        }
      },
      {
        test: /\.(jpg)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: '/images/',
            name: '[name]-[hash:6].[ext]'
          }
        }
      }
    ]
  }
}
