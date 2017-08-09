var app = app || {};

app.User = Backbone.Model.extend({
  urlRoot: '/api/user/'
});

app.UserSnippets = Backbone.Model.extend({
  urlRoot: '/api/snippet/'
});

app.UserProyects = Backbone.Model.extend({

});