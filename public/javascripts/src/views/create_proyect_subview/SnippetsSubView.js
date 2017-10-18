module.exports = Mn.View.extend({
  /*
  * Sub View for search and add snippets to proyect
  *
  * className for li:
  *   when no added: fa-plus
  *   when added: fa-remove
  * */
  template: '#sub-view-proyect-snippets',
  _template_snippet: _.template("<li data-id={{=id}}><i class='fa fa-{{=icon}}'></i>{{=filename}}</li>"),
  ui: {
    search: 'input#search',
    close: '#ui-close-card',
    ul: 'ul'
  },
  events: {
    'keyup @ui.search': 'searchSnippets'
  },
  triggers: {
    'click @ui.close': 'snippetWillClose'
  },
  searchSnippets: function (event) {
    console.log(event);
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
          icon: 'plus'
        }));
      } else {
        return false
      }
    });
  },
});