const template = require('../../../../views/application_views/pagination.erb')

module.exports = Mn.View.extend({
  template: template,
  regions: {
    collectionRegion: '#regionCollection'
  },
  initialize: function() {
    this.collection_view = this.getOption('collection_view');
  },
  templateContext: function() {
    var description = this.getOption('description');

    return {
      description : description
    }
  },
  onRender: function () {
    this.showChildView('collectionRegion', new this.collection_view({
      collection: this.collection
    }));
  }
});