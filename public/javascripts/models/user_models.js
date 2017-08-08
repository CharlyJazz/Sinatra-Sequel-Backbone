var app = app || {};

app.User = Backbone.Model.extend({
  urlRoot: '/api/user/'
});

app.UserSnippets = Backbone.Model.extend({});

app.UserProyects = Backbone.Model.extend({});