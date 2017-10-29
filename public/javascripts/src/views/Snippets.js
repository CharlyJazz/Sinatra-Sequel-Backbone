const CollectionSubView = require('./snippets_subviews/SnippetCollectionSubView')
const template = require('../../../../views/application_views/snippets.erb')

module.exports = Mn.View.extend({
  template: template,
  regions: {
    snippetsRegion: '#snippets'
  },
  onRender: function () {
    this.renderSnippets();
  },
  renderSnippets: function () {
    this.showChildView('snippetsRegion', new CollectionSubView({
      collection: this.collection
    }));
  }
});