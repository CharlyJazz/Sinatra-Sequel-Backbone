var app = app || {};

app.UserCollection = Backbone.Collection.extend({
  model: app.User,
  url: '/api/user/'
});

app.UserSnippetsCollection = Backbone.Collection.extend({
  model: app.Snippet,
  initialize: function(models, options) {
    this.user_id = options.user_id;
    this.limit = options.limit;
  },
  url: function() {
    if (typeof(this.limit) === "number") {
      return '/api/user/' + this.user_id + '/snippets?$limit=' + this.limit;
    }
    return '/api/user/' + this.user_id + '/snippets';
  }
});

app.UserProyectsCollection = Backbone.Collection.extend({
  model: app.Proyect,
  initialize: function(models, options) {
    this.user_id = options.user_id;
    this.limit = options.limit;
  },
  url: function() {
    if (typeof(this.limit) === "number") {
      return '/api/user/' + this.user_id + '/proyects?$limit=' + this.limit;
    }
    return '/api/user/' + this.user_id + '/proyects';
  }
});