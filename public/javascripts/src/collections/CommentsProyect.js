const Model = require('../models/CommentProyect')

module.exports = Backbone.Collection.extend({
  model: Model,
  url: function() {
    return  '/api/proyect/' + this.idParent + '/comment'
  },
  initialize: function (models, options) {
    this.idParent = options.idParent;
  }
});