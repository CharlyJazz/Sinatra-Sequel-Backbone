const Model = require('../models/Snippet')

module.exports = Backbone.Collection.extend({
  // Collection of all snippets with pagination
  model: Model,
  initialize: function(models, options) {
    this.page = options.page || 1;
  },
  url: function(page) {
    return '/api/snippet/?page=' + this.page;
  },
  update_url: function(new_page){
    /*
     * Update url with the new page if is a integer
     * */
    if (!isNaN(parseInt(new_page)) && new_page === parseInt(new_page, 10)) {
      return this.url = '/api/snippet/?page=' + new_page;
    }
    throw 'The new page index should a integer'
  }
});