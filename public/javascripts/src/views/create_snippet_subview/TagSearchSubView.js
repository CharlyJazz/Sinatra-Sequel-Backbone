const template = require('../../../../../views/application_sub_views/search_tags.erb');

module.exports = Mn.View.extend({
  template: template,
  className: 'row',
  ui:{
    list: '#ul-tags'
  },
  initialize: function () {
    this.collection.fetch();
  }
});