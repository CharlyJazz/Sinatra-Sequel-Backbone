const messages = require('../../../../tmp/messages.json')

module.exports = Backbone.Model.extend({
  urlRoot: '/api/proyect/',
  validate: function(attrs, options) {
    if (attrs.name.length < 4 || attrs.name.length > 80) {
      return messages['proyect'].name;
    }

    if (attrs.description.length < 4 || attrs.description.length > 120) {
      return messages['proyect'].description;
    }

    if (!_.isNumber(attrs.user_id) || !_.isNumber(parseInt(attrs.user_id))) {
      return messages['proyect'].user_id;
    }
  }
});