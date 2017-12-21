const Collection = require('../../collections/UserProyectsCollection')
const template = require('../../../../../views/application_sub_views/proyect_preview.erb')
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
      className: 'col-lg-4 mb-3'
    });
    this.collection = new Collection([], {
      user_id: this.user_id,
      limit: 6
    });
    this.collection.fetch();
  },
  CheckIfEmpty: function () {
    if (this.collection.length === 0){
      this.trigger('noHaveProyects');
    }
  }
});