var app = app || {};

app.SnippetCollection = Backbone.Collection.extend({
  model: app.Snippet,
  url: '/api/snippet/'
});