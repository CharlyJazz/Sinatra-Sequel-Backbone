const template = require('../../../../../views/application_sub_views/snippet_preview.erb');
const CollectionView = require('../CollectionViewBase');

module.exports = CollectionView.extend({
  className: 'row mt-3',
  initialize: function() {
    this.childView = Mn.View.extend({
      template: template,
      className: 'col-lg-6 box_snippet_preview'
    });
    this.collection.fetch({
      success: function () {
        prettyPrint() // Code Prettify
      }
    });
  }
});