const Model = require('../models/Proyect')

module.exports = Backbone.Collection.extend({
  // Collection of all proyects with pagination
  model: Model,
  initialize: function(models, options) {
    this.page = options.page || 1;
  },
  url: function(page) {
    return '/api/proyect/?page=' + this.page;
  },
  update_url: function(new_page){
    /*
     * Update url with the new page if is a integer
     * */
    if (!isNaN(parseInt(new_page)) && new_page === parseInt(new_page, 10)) {
      return this.url = '/api/proyect/?page=' + new_page;
    }
    throw 'The new page index should a integer'
  }
});