const messages = require('../../../../tmp/messages.json')

module.exports = Backbone.Model.extend({
  urlRoot: '/api/snippet/',
  initialize: function (options) {
    this.id = options.id;
    this.urlRootLikes = this.urlRoot + this.id + '/like'
  },
  validate: function(attrs, options) {
    var pattern = /^[\w,\s-]+\.[A-Za-z]{1,5}$/;

    if (!pattern.test(attrs.filename)) {
      return messages['snippet'].validation.filename;
    }

    if (attrs.body.length <= 4) {
      return messages['snippet'].validation.body;
    }

    if (!_.isNumber(attrs.user_id) || !_.isNumber(parseInt(attrs.user_id))) {
      return messages['snippet'].validation.user_id;
    }
  },
  getLikesCount: function () {
    /*
    * Get count of all likes of the snippet
    * */
    return $.ajax({
      type: 'GET',
      url: this.urlRootLikes
    });
  },
  createOrDeleteLike: function (user_id) {
    /*
    * Create or Delete like
    * */
    return $.ajax({
      type: 'POST',
      url: this.urlRootLikes + '/' + user_id
    });
  }
});