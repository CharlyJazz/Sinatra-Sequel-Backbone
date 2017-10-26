const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'public/javascripts/src/app.js'),
  output: {
    path: path.resolve(__dirname, 'public/javascripts/bin/'),
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.erb$/,
        loader: "underscore-template-loader",
        query: {
          interpolate: /\{\{\=(.+?)\}\}/g,
          evaluate: /\{\{(.+?)\}\}/g
        }
      }
    ]
  }
};