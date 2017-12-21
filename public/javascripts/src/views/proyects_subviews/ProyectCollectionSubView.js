const template = require('../../../../../views/application_sub_views/proyect_preview.erb');
const CollectionView = require('../CollectionViewBase');

module.exports = CollectionView.extend({
  className: 'row mt-3',
  initialize: function() {
    this.childView = Mn.View.extend({
      template: template,
      className: 'col-lg-4 mb-3'
    });
    this.collection.fetch();
  }
});