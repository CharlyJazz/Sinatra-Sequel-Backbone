var app = app || {};

app.SnippetsView = Mn.View.extend({
  template: '#container-snippets',
  regions: {
    snippetsRegion: '#snippets'
  },
  childViewEvents: {
    'prettyTrigger': function(){console.log(0) && prettyPrint()}
  },
  onRender: function () {
    this.renderSnippets();
  },
  renderSnippets: function () {
    this.showChildView('snippetsRegion', new app.SnippetCollectionSubView({
      collection: this.collection
    }));
  }
});

app.SnippetCollectionSubView = Mn.CollectionView.extend({
  className: 'row mt-3',
  initialize: function(options) {
    this.childView = Mn.View.extend({
      template: "#sub-view-snippet-all",
      className: 'col-lg-6'
    });
    this.collection.fetch({
      success: function () {
        prettyPrint() // Code Prettify
      }
    });
  },
  onRender: function () {
    this.trigger('prettyTrigger');
  }
});
