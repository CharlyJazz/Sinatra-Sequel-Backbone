// Load javascripts dependencys

require('bootstrap');
require('jquery-toast-plugin')
require('jquery-dateformat/dist/jquery-dateFormat')
require('code-prettify/loader/prettify')

// Load App helpers

require('./helpers/changeInterpolation')
require('./helpers/jquery-material-inputTag')

// Load CSS dependencys

require('bootstrap/dist/css/bootstrap.min.css')
require('codemirror/lib/codemirror.css')
require('codemirror/theme/ttcn.css')
require('jquery-toast-plugin/dist/jquery.toast.min.css')
require('code-prettify/src/prettify.css')

// Load SASS main file

require('../../stylesheets/sass/main.scss')

// Application

const Application = require('./application/App');

const App = new Application();

// Overwriter Backbone sync
var backboneSync = Backbone.sync;

// Send token in the request header if exist
Backbone.sync = function (method, model, options) {
  var token = App.current_user.get_token();

  if (token) {
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer '.concat(token))
    }
  }

  backboneSync(method, model, options);
};

document.addEventListener('DOMContentLoaded', function() {
  App.start();
});