const Proyect = require('../models/Proyect')
const Snippets = require('../collections/UserSnippetsCollection')
const ProyectSnippets = require('../models/ProyectSnippet')
const SnippetsSubView = require('./create_proyect_subview/SnippetsSubView')
const toastError = require('../helpers/toastConnectionError')
const messages = require('../../../../tmp/messages.json')
const template = require('../../../../views/application_views/create_proyect.erb');

module.exports = Mn.View.extend({
  template: template,
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
    remove: '.fa-remove.ui-snippet-selected',
    form: 'form'
  },
  events: {
    'click @ui.button_show_snippets': 'showSnippets',
    'click @ui.remove': 'removeSnippet',
    'submit @ui.form': 'createProyect'
  },
  modelEvents: {
    sync: function() {
      this.showToastCreate();
      if (!this._relationProyectWithSnippets()) {
        this.resetForm();
        this.application.BasicRouter.navigate('proyects/' + this.model.get('id') , {trigger: true});
      }
    },
    error: function () {
      toastError();
    },
    invalid: 'showToastInvalid'
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
    this.application = this.getOption('application');
    this.model = new Proyect({});
    this.collection = new Snippets([], {
      user_id: this.application.current_user.get('id')
    });
  },
  createProyect: function () {
    /*
     * Validate name and description and create Proyect
     * */
    var name = this.getUI('name').val().trim(),
        description = this.getUI('description').val().trim();

    this.model.set({
      name: name,
      description: description,
      user_id: this.application.current_user.get('id')
    });

    this.model.save();
  },
  _relationProyectWithSnippets: function () {
    var snippets_id = _.map(this.collection.where({selected: true}), function(model) {
      return model.get('id')
    });

    var that = this;

    if (snippets_id.length) {

      this.proyect_snippets = new ProyectSnippets({
        proyect_id: this.model.get('id'),
        snippets_id: snippets_id
      });

      this.listenTo(this.proyect_snippets, 'sync', function() {
        that.showToastSnippets();
        that.resetForm();
        that.application.BasicRouter.navigate('proyects/' + that.model.get('id') , {trigger: true});
      });

      this.proyect_snippets.save();

      return true;

    } else {

      return false;
    }
  },
  resetForm: function () {
    /*
    * Reset for and change snippets attr selected to false
    * */

    this.getUI('form')[0].reset();

    this.getUI('ul_snippets_selected').empty();

    _.forEach(this.collection.where({selected: true}), function(model) {
      model.set({selected: false});
    });
  },
  showToastCreate: function () {
    $.toast({
      heading: 'Success!',
      text: messages['proyect'].create,
      icon: 'success',
      showHideTransition: 'slide'
    });
  },
  showToastSnippets: function () {
    /*
     * Toast when created relation between Proyect and Snippets
     * */
    $.toast({
      heading: 'Success!',
      text: messages['proyect'].snippet.create,
      icon: 'success',
      showHideTransition: 'slide'
    });
  },
  showToastInvalid: function (model, error, options) {
    $.toast({
      heading: 'Error!',
      text: error,
      icon: 'error',
      showHideTransition: 'slide'
    });
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