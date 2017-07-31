var app = app || {};

app.UserCollection = Backbone.Collection.extend({
  model: app.User,
  url: '/api/user/'
});