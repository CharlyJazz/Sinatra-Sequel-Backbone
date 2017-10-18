const Proyect = require('../models/Proyect')
const Snippets = require('../collections/UserSnippetsCollection')
const SnippetsSubView = require('./create_proyect_subview/SnippetsSubView')
const toastError = require('../helpers/toastConnectionError')

module.exports = Mn.View.extend({
  template: '#container-create-proyect',
  _template_snippet: _.template("<li data-id={{=id}}><i class='fa fa-remove ui-snippet-selected'></i>{{=filename}}</li>"),
  regions: {
    snippets: '#region-snippets'
  },
  ui: {
    submit: 'button#submit',
    button_show_snippets: 'button#add-snippets',
    name: 'input#name',
    description: 'textarea#description',
    card_snippets: 'div.card-tag-searched',
    ul_snippets_selected: 'ul#ui-ul-snippet-selected',
    remove: '.fa-remove.ui-snippet-selected'
  },
  events: {
    'click @ui.submit': 'createProyect',
    'click @ui.button_show_snippets': 'showSnippets',
    'click @ui.remove': 'removeSnippet'
  },
  modelEvents: {
    sync: 'showToastCreate',
    error: 'showToastError'
  },
  childViewEvents: {
    'snippetWillClose': function() {
      this.renderSnippets();
      this.destroySnippetSubView();
    },
    'snippetWillRemove': function(view, event) {
      this.removeSnippet(event, true);
    }
  },
  initialize: function() {
    this.application = this.getOption('application')
    this.model = new Proyect();
    this.collection = new Snippets([], {
      user_id: this.application.current_user.get('id')
    })
  },
  createProyect: function (event) {
    /*
     * Validate name and description and create Proyect
     * */
    var name = this.getUI('name').val().trim(),
        description = this.getUI('description').val().trim(),
        button = $(event.target);

    button.prop('disabled', true);

    if (name.length >= 4 && name.length <= 80 &&
      description.length >= 4 && description.length <= 120) {

      this.model.set({
        'name': name,
        'description': description,
        'user_id': this.application.current_user.get('id')
      });

      this.model.save();

      // TODO: Crear estilos para la lista de snippetse agregados de esta vista
      // TODO: Revisar si hay snippets agregados y mandar ajax para crear relacion.
      // TODO: Mostrar toast para el sync de los snippets relacionados con el proyecto
      // TODO: Redireccionar hacia el proyecto
    }
  },
  showToastCreate: function () {
    $.toast({
      heading: 'Success!',
      text: 'Your proyect was created with success',
      icon: 'success',
      showHideTransition: 'slide'
    });
  },
  showToastError: function () {
    toastError();
  },
  showSnippets: function () {
    var that = this,
        collection = new SnippetsSubView({collection: this.collection}),
        showView = function() {that.showChildView('snippets', collection)}

    this.getUI('card_snippets').removeClass('hidden-element');

    if (this.collection.isEmpty()) {

      this.collection.fetch();

      this.collection.on('sync', function() {
        showView();
      });

    } else {
      showView();
    }
  },
  renderSnippets: function () {
    /*
    * Get snippets from SnippetsSubView
    * */
    var ul = this.getUI('ul_snippets_selected'),
        template = this._template_snippet;

    ul.empty();

    _.forEach(this.collection.where({selected: true}), function(model) {
      ul.append(template(model.toJSON()));
    });
  },
  destroySnippetSubView: function () {
    this.getUI('card_snippets').addClass('hidden-element');

    var regionView = this.getChildView('snippets');
    regionView.destroy();
  },
  removeSnippet: function (event, remove) {
    var button = $(event.target),
        model = this.collection.get(button.parent('li').data('id'));

    remove ? button.removeClass('fa-remove').addClass('fa-plus')
           : button.parent('li').remove();

    model.set({selected: false});
  }
});