const Collection = require('../../collections/ProyectSnippets')
const template = require('../../../../../views/application_sub_views/proyect_snippet.erb');

module.exports = Mn.CollectionView.extend({
  tagName: 'ul',
  className: 'collection',
  initialize: function(options) {
    var that = this;

    this.parent = options.parent;

    var current_user = this.parent.getOption('application').current_user;

    this.childView = Mn.View.extend({
      template: template,
      tagName: 'li',
      className: 'collection-item',
      ui: {
        remove: '.fa-remove'
      },
      events: {
        'click @ui.remove': 'removeSnippet'
      },
      templateContext: function() {
        return {
          user_authenticated_is_the_owner: function(id_user) {
            return current_user.is_authenticated() && current_user.get('id') == id_user
          }
        }
      },
      removeSnippet: function () {
        that.collection.removeSnippet(this.model.get('id'));
        that.collection.remove(this.model);
      }
    });

    this.collection = new Collection([], {
      idParent: options.idParent
    });

    this.collection.fetch();
  }
})