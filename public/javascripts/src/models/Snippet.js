module.exports = Backbone.Model.extend({
  urlRoot: '/api/snippet/',
  initialize: function (options) {
    this.id = options.id;
    this.urlRootLikes = this.urlRoot + this.id + '/like'
  },
  getLikesCount: function () {
    return $.ajax({
      type: 'GET',
      url: this.urlRootLikes
    });
  }
});