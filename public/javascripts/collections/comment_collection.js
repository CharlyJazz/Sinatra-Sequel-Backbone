var app = app || {};

app.CommentCollection = Backbone.Collection.extend({
  model: Backbone.Model.extend({
    defaults: {
      created_at: Date.now(),
      title: '',
      line_code: '',
      user_picture: '',
      user_name: ''
    }
  }),
  url: function(){
    return  '/api/' + this.modelParent + '/' + this.idParent + '/comment'
  },
  initialize: function (models, options) {
    this.modelParent = options.modelParent; // Should snippet or proyect
    this.idParent = options.idParent // Id of parent model
  }
});