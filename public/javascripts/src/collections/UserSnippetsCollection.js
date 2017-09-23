const Model = require('../models/Snippet')

module.exports = Backbone.Collection.extend({
  model: Model,
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