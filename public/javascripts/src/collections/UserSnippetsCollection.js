const Model = require('../models/Snippet')

module.exports = Backbone.Collection.extend({
  model: Model,
  initialize: function(models, options) {
    this.user_id = options.user_id;
    this.limit = options.limit;
    this.page = options.page;
  },
  url: function() {
    if (typeof(this.limit) === 'number') {
      return '/api/user/' + this.user_id + '/snippets?$limit=' + this.limit;
    }
    else if (typeof(this.page) === 'number') {
      return '/api/user/' + this.user_id + '/snippets?page=' + this.page;
    }
    return '/api/user/' + this.user_id + '/snippets';
  },
  update_url: function(new_page){
    /*
     * Update url with the new page if is a integer
     * */
    if (!isNaN(parseInt(new_page)) && new_page === parseInt(new_page, 10)) {
      return this.url = '/api/user/' + this.user_id + '/snippets?page=' + new_page;
    }
    throw 'The new page index should a integer'
  },
  search: function(letters) {
    if(letters === '') return this;
    var pattern = new RegExp(letters, 'gi');
    return _(this.filter(function(data) {
      return pattern.test(data.get('filename'));
    }));
  }
});