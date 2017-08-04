var app = app || {};

app.Application = Mn.Application.extend({

  onStart: function() {
    // Current user authenticated or guest
    // Very Important for the render of the header
    app.current_user = new app.CurrentUser({
      username: this.options.username,
      email: this.options.email,
      id: this.options.id,
      permission_level: this.options.permission_level
    });

    new app.ApplicationHeaderView();

    new app.ApplicationBasicRouter();

    if (this.options.permission_level > 0) {
      new app.UserAuthRouter();
    }

    Backbone.history.start();
    
  }
    
});

// https://stackoverflow.com/questions/7514922/rails-with-underscore-js-templates

_.templateSettings = {
  interpolate: /\{\{\=(.+?)\}\}/g,
  evaluate: /\{\{(.+?)\}\}/g
};

// https://www.sitepoint.com/using-json-web-tokens-node-js/

// Store "old" sync function
var backboneSync = Backbone.sync;

// Now override
Backbone.sync = function (method, model, options) {
  /*
   * "options" represents the options passed to the underlying $.ajax call
   * */
  var token = app.current_user.get_token(); // Check if user is login and get the token
  if (token) {
    options.headers = {
      'x-access-token': token
    }
  }
  // call the original function
  backboneSync(method, model, options);
};