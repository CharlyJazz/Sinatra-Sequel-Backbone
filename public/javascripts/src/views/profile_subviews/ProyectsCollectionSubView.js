const Collection = require('../../collections/UserProyectsCollection')

module.exports = Mn.CollectionView.extend({
  className: 'row mt-3',
  collectionEvents: {
    'sync': 'CheckIfEmpty'
  },
  initialize: function(options) {
    this.user_id = this.options.user_id;
    this.childView = Mn.View.extend({
      template: "#sub-view-proyect",
      className: 'col-lg-4'
    });
    this.collection = new Collection([], {
      user_id: this.user_id,
      limit: 6
    });
    this.collection.fetch();
  },
  CheckIfEmpty: function () {
    if (this.collection.length === 0){
      this.trigger('noHaveProyects'); // TODO: refactorizar esto con
      // TODO: https://marionettejs.com/docs/v2.4.3/marionette.collectionview.html#collectionviews-isempty
    }
  }
});