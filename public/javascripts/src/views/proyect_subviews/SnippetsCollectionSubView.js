const Collection = require('../../collections/ProyectSnippets')
const template = require('../../../../../views/application_sub_views/proyect_snippet.erb');
const CollectionView = require('../CollectionViewBase');

module.exports = CollectionView.extend({
  tagName: 'ul',
  className: 'collection',
  initialize: function(options) {
    this.parent = options.parent;

    var that = this;

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
        var token = that.parent.getOption('application').current_user.get_token();

        that.collection.removeSnippet(this.model.get('id') , token);
        that.collection.remove(this.model);
      }
    });

    this.collection = new Collection([], {
      idParent: options.idParent
    });

    this.collection.fetch();
  }
})