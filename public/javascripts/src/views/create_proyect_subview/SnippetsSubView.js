const template = require('../../../../../views/application_sub_views/search_snippets.erb');

module.exports = Mn.View.extend({
  /*
  * Sub View for search and add snippets to proyect
  *
  * className for li:
  *   when no added: fa-plus
  *   when added: fa-remove
  * */
  template: template,
  _template_snippet: _.template("<li data-id={{=id}}><i class='fa fa-{{=icon}}'></i>{{=filename}}</li>"),
  ui: {
    search: 'input#search',
    close: '#ui-close-card',
    ul: 'ul',
    add: '.fa-plus',
    remove: '.fa-remove'
  },
  events: {
    'keyup @ui.search': 'searchSnippets',
    'click @ui.add': 'addSnippet',
  },
  triggers: {
    'click @ui.close': 'snippetWillClose',
    'click @ui.remove': 'snippetWillRemove'
  },
  searchSnippets: function (event) {
    var value = event.target.value;
    if (value.trim()) {
      var snippets = this.collection.search(value), // Get collection and search snippets
          ul = this.getUI('ul');
      if (snippets.size() === 0) { return undefined; } // Prevent show empty
      ul.empty();
      var template = this._template_snippet;
      snippets.each(function(model, index) {
        if (index >= 10) { return undefined } // Prevent shown more that 10 tags
        ul.append(template({
          id: model.get('id'),
          filename: model.get('filename'),
          icon: model.get('selected') === false || model.get('selected') === undefined ? 'plus' : 'remove'
        }));
      });
    }
  },
  onRender: function () {
    var ul = this.getUI('ul'),
        template = this._template_snippet;

    this.getUI('search').prop('disabled', false);

    this.collection.each(function(model, index) {
      if (index <= 10) {
        ul.append(template({
          id: model.get('id'),
          filename: model.get('filename'),
          icon: model.get('selected') === false || model.get('selected') === undefined ? 'plus' : 'remove'
        }));
      } else {
        return false
      }
    });
  },
  addSnippet: function (event) {
    var button = $(event.target),
        model = this.collection.get(button.parent('li').data('id'));

    button.removeClass('fa-plus').addClass('fa-remove');
    model.set({selected: true})
  }
});