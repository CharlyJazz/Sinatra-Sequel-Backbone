const Collection = require('../../collections/UserSnippetsCollection')
const template = require('../../../../../views/application_sub_views/snippet_preview.erb')
const CollectionView = require('../CollectionViewBase');

module.exports = CollectionView.extend({
  className: 'row mt-3',
  collectionEvents: {
    'sync': 'CheckIfEmpty'
  },
  initialize: function() {
    this.user_id = this.options.user_id;
    this.childView = Mn.View.extend({
      template: template,
      className: 'col-lg-6'
    });
    this.collection = new Collection([], {
      user_id: this.user_id,
      limit: 4
    });
    this.collection.fetch({
      success: function () {
        prettyPrint() // Code Prettify
      }
    });
  },
  CheckIfEmpty: function () {
    if (this.collection.length === 0){
      this.trigger('noHaveSnippets');
    }
  }
});