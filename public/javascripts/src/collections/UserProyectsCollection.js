const Model = require('../models/Proyect')

module.exports = Backbone.Collection.extend({
  model: Model,
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