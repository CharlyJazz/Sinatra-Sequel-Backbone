// https://stackoverflow.com/questions/7514922/rails-with-underscore-js-templates

_.templateSettings = {
  interpolate: /\{\{\=(.+?)\}\}/g,
  evaluate: /\{\{(.+?)\}\}/g
};