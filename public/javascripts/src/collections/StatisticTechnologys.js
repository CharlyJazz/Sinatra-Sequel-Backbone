const Model = require('../models/Snippet')

module.exports = Backbone.Collection.extend({
  model: Model,
  initialize: function(models, options) {
    this.user_id = options.user_id;
  },
  url: function() {
    return '/api/user/' + this.user_id + '/statistics/technologys';
  }
});