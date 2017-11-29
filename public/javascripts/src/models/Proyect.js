const messages = require('../../../../tmp/messages.json')

module.exports = Backbone.Model.extend({
  urlRoot: '/api/proyect/',
  initialize: function (options) {
    this.id = options.id;
    this.urlRootLikes = this.urlRoot + this.id + '/like'
  },
  validate: function(attrs, options) {
    if (attrs.name.length < 4 || attrs.name.length > 80) {
      return messages['proyect'].name;
    }

    if (attrs.description.length < 4 || attrs.description.length > 450) {
      return messages['proyect'].description;
    }

    if (!_.isNumber(attrs.user_id) || !_.isNumber(parseInt(attrs.user_id))) {
      return messages['proyect'].user_id;
    }
  },
  getLikesCount: function () {
    /*
    * Get count of all likes of the proyect
    * */
    return $.ajax({
      type: 'GET',
      url: this.urlRootLikes
    });
  },
  createOrDeleteLike: function (user_id, token) {
    /*
    * Create or Delete like
    * */
    return $.ajax({
      type: 'POST',
      url: this.urlRootLikes + '/' + user_id,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer '.concat(token))
      }
    });
  }
});