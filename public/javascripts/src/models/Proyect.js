module.exports = Backbone.Model.extend({
  urlRoot: '/api/proyect/',
  validate: function(attrs, options) {
    if (attrs.name.length < 4 || attrs.name.length > 80) {
      return 'The length of the name not is valid';
    }

    if (attrs.description.length < 4 || attrs.description.length > 120) {
      return 'The length of the description not is valid';
    }

    if (!_.isNumber(attrs.user_id) || !_.isNumber(parseInt(attrs.user_id))) {
      return 'The user id need are valid integer';
    }
  }
});