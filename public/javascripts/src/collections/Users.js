const Model = require('../models/User')

module.exports = Backbone.Collection.extend({
  model: Model,
  url: '/api/user/'
});