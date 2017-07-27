const path = require('path');

module.exports = {
  entry: './client/index.js',
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
                'targets': { 'browsers': '> 3%' }
              }],
              'react'
            ],
            plugins: ['transform-object-rest-spread']
            // plugins: [require('babel-plugin-transform-object-rest-spread')]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
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
