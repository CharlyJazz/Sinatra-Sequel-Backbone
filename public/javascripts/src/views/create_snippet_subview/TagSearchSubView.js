module.exports = Mn.View.extend({
  template: '#sub-view-tags',
  className: 'row',
  ui:{
    list: '#ul-tags'
  },
  initialize: function () {
    this.collection.fetch();
  }
});