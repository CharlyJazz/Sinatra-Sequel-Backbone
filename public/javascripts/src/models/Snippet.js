module.exports = Backbone.Model.extend({
  urlRoot: '/api/snippet/',
  initialize: function (options) {
    this.id = options.id;
    this.urlRootLikes = this.urlRoot + this.id + '/like'
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