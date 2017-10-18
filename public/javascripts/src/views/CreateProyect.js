const Proyect = require('../models/Proyect')
const Snippets = require('../collections/UserSnippetsCollection')
const SnippetsSubView = require('./create_proyect_subview/SnippetsSubView')
const toastError = require('../helpers/toastConnectionError')

module.exports = Mn.View.extend({
  template: '#container-create-proyect',
  regions: {
    snippets: '#region-snippets'
  },
  events: {
    'click @ui.submit': 'createProyect',
    'click @ui.button_show_snippets': 'showSnippets'
  },
  modelEvents: {
    sync: 'showToastCreate',
    error: 'showToastError'
  },
  childViewEvents: {
    'snippetWillClose': function() {
      this.getSnippets();
      this.destroySnippetSubView();
    }
  },
  ui: {
    submit: 'button#submit',
    button_show_snippets: 'button#add-snippets',
    name: 'input#name',
    description: 'textarea#description',
    card_snippets: 'div.card-tag-searched'
  },
  initialize: function() {
    this.application = this.getOption('application')
    this.model = new Proyect();
    this.collection = new Snippets([], {
      user_id: this.application.current_user.get('id')
    })
  },
  onRender: function() {
    /*
     * Add snippets region
     * */
  },
  createProyect: function () {
    /*
     * Validate name and description and create Proyect
     * */
    var name = this.getUI('name').val().trim(),
      description = this.getUI('description').val().trim();

    if (name.length >= 4 && name.length <= 80 &&
      description.length >= 4 && description.length <= 120) {

      this.model.set({
        'name': name,
        'description': description,
        'user_id': this.application.current_user.get('id')
      });

      this.model.save();
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
  getSnippets: function () {
    /*
    * Get snippets from SnippetsSubView
    * */
    console.log('get')
  },
  destroySnippetSubView: function () {
    this.getUI('card_snippets').addClass('hidden-element');

    var regionView = this.getChildView('snippets');
    regionView.destroy();
  }
});