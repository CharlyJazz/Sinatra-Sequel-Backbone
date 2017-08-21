var app = app || {};

app.CommentCollection = Backbone.Collection.extend({
  model: Backbone.Model,
  url: function(){
    return  '/api/' + this.modelParent + '/' + this.idParent + '/comment'
  },
  initialize: function (models, options) {
    this.modelParent = options.modelParent; // Should snippet or proyect
    this.idParent = options.idParent // Id of parent model
  }
});