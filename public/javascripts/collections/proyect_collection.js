var app = app || {};

app.TagCollection = Backbone.Collection.extend({
  model: app.Proyect,
  url: '/api/proyect/'
});