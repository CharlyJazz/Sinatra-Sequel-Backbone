var app = app || {};

app.ProfileView = Mn.View.extend({
  el: 'main',
  template: '#container-profile',
  regions: {
    snippetsRegion: '#snippets-region',
    proyectsRegion: '#proyects-region'
  },
  modelEvents: {
    'sync': 'renderRegions'
  },
  initialize: function () {
    this.user_id = this.model.id;
    this.model.fetch();
  },
  renderRegions: function () {
    this.render();
    this.showChildView('snippetsRegion', new app.SnippetsCollectionView({
      user_id: this.user_id
    }));
    this.showChildView('proyectsRegion', new app.ProyectsCollectionView({
      user_id: this.user_id
    }));
  }
});

app.SnippetsCollectionView = Mn.CollectionView.extend({
  className: 'row mt-3',
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
    this.collection.fetch();
  }
});

app.ProyectsCollectionView = Mn.CollectionView.extend({
  className: 'row mt-3',
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
  }
});