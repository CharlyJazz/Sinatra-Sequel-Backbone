module.exports = Backbone.Collection.extend({
  // Collection of all snippets with pagination
  model: Backbone.Model,
  initialize: function (options) {
    this.snippet_id = options.snippet_id
  },
  url: function() {
    return '/api/snippet/' + this.snippet_id + '/tag';
  },
  removeTags: function(array_tags_name) {
    /*
    * Passing array with the names
    * */
    return $.ajax({
      type: 'DELETE',
      url: this.url(),
      data: {name: array_tags_name.toString()}
    });
  },
  addTags: function(array_tags_name) {
    /*
     * Passing array with the names
     * */
    return $.ajax({
      type: 'POST',
      url: this.url(),
      data: {name: array_tags_name.toString()}
    });
  }
});