const path = require('path');
const Webpack = require('webpack');


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
      },
      {
        test: /\.s?css$/i,
        loaders: ['style', 'css']
      }
    ]
  },
  plugins: [
    new Webpack.ProvidePlugin({
      _: 'underscore',
      $: 'jquery',
      jQuery: 'jquery',
      Backbone: 'backbone',
      Bb: 'backbone',
      Marionette: 'backbone.marionette',
      Mn: 'backbone.marionette'
    }),
    /* TODO: Uncomment when the App are completed
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
    })
    */
  ]
};