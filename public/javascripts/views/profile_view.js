var app = app || {};

app.ProfileView = Mn.View.extend({
  template: '#container-profile',
  regions: {
    snippetsRegion: '#snippets-region',
    proyectsRegion: '#proyects-region'
  },
  modelEvents: {
    'sync': 'renderRegions'
  },
  childViewEvents: {
    'noHaveSnippets': 'hiddenSnippetHTML',
    'noHaveProyects': 'hiddenProyectHTML'
  },
  ui:{
    'title_snippets_block': 'h1#title-popular-snippets',
    'anchor_snippets_block': 'a#anchor-popular-snippets',
    'title_proyects_block': 'h1#title-popular-proyects',
    'anchor_proyects_block': 'a#anchor-popular-proyects'
  },
  initialize: function () {
    this.user_id = this.model.id;
  },
  renderRegions: function () {
    this.showChildView('snippetsRegion', new app.SnippetsCollectionView({
      user_id: this.user_id
    }));
    this.showChildView('proyectsRegion', new app.ProyectsCollectionView({
      user_id: this.user_id
    }));
  },
  hiddenSnippetHTML: function () {
    this.getUI('title_snippets_block').fadeOut(300);
    this.getUI('anchor_snippets_block').fadeOut(300);
  },
  hiddenProyectHTML: function () {
    this.getUI('title_proyects_block').fadeOut(300);
    this.getUI('anchor_proyects_block').fadeOut(300);
  }
});

app.SnippetsCollectionView = Mn.CollectionView.extend({
  className: 'row mt-3',
  collectionEvents: {
    'sync': 'CheckIfEmpty'
  },
  initialize: function(options) {
    this.user_id = this.options.user_id;
    this.childView = Mn.View.extend({
      template: "#sub-view-snippet",
      className: 'col-lg-6'
    });
    this.collection = new app.UserSnippetsCollection([], {
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

app.ProyectsCollectionView = Mn.CollectionView.extend({
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
    this.collection = new app.UserProyectsCollection([], {
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