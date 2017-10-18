const Model = require('../models/Tag')

module.exports = Backbone.Collection.extend({
  model: Model,
  url: '/api/tag/',
  search: function(letters) {
    if(letters === '') return this;
    let pattern = new RegExp(letters, 'gi');
    return _(this.filter(function(data) {
      return pattern.test(data.get('name'));
    }));
  }
});