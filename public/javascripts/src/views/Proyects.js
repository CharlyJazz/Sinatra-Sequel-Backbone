const CollectionSubView = require('./proyects_subviews/ProyectCollectionSubView')
const template = require('../../../../views/application_views/proyects.erb')

module.exports = Mn.View.extend({
  template: template,
  regions: {
    proyectsRegion: '#proyects'
  },
  onRender: function () {
    this.renderProyects();
  },
  renderProyects: function () {
    this.showChildView('proyectsRegion', new CollectionSubView({
      collection: this.collection
    }));
  }
});