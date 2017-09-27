const Collection = require('../../collections/SnippetsTags')

module.exports = Mn.View.extend({
  template: '#sub-view-tags-snippet',
  className: 'mt-2',
  ui: {
    'input': 'input#tags'
  },
  collectionEvents: {
    'sync': 'addTags'
  },
  initialize: function () {
    this.current_user = this.getOption('current_user');
    this.collection = new Collection({
      snippet_id: this.getOption('idParent')
    });
    this.collection.fetch();
  },
  templateContext: function() {
    var that = this;
    return {
      is_disabled: function() {
        return !that.current_user.is_authenticated() ||
                that.current_user.get('id') !== that.getOption('idUserParent')
      }
    }
  },
  onRender: function () {
    this.getUI('input').materialtags();
  },
  addTags: function () {
    var input = this.getUI('input')
    this.collection.forEach(function (tag) {
      input.materialtags('add', tag.get('name'));
    })
  }
});