var app = app || {};

app.CommentCollection = Backbone.Collection.extend({
  model: app.CommentSnippet,
  url: function(){
    return  '/api/snippet/' + this.idParent + '/comment'
  },
  initialize: function (models, options) {
    this.idParent = options.idParent; // id of parent model
  }
});