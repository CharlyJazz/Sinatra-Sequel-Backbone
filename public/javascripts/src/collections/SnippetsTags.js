module.exports = Backbone.Collection.extend({
  // Collection of all snippets with pagination
  model: Backbone.Model,
  initialize: function (options) {
    this.snippet_id = options.snippet_id
  },
  url: function() {
    return '/api/snippet/' + this.snippet_id + '/tag';
  }
});