const Model = require('../models/CommenSnippet')

module.exports = Backbone.Collection.extend({
  model: Model,
  url: function(){
    return  '/api/snippet/' + this.idParent + '/comment'
  },
  initialize: function (models, options) {
    this.idParent = options.idParent;
  }
});