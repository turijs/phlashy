const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'bundle.js',
    publicPath: 'dist/'
  },
  devServer: {
    contentBase: './client'
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
              // ['env', {
              //   'targets': { 'browsers': '> 3%' }
              // }],
              'env',
              'react'
            ]
            // plugins: [require('babel-plugin-transform-object-rest-spread')]
          }
        }
      }
    ]
  }
}
