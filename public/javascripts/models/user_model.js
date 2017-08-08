var app = app || {};

app.User = Backbone.Model.extend({
  urlRoot: '/api/user/'
});