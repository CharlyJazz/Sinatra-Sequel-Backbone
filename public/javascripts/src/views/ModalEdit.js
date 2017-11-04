const template = require('../../../../views/application_modals/edit_modal.erb');

module.exports = Mn.View.extend({
  /*
   * This modal if a multi use view
   * for edit a snippet, proyect, comment, or profile
   *
   * Arguments:
   * @model or collection: Model or Collection
   * @id: Id of the model for search in collection
   * @title: String should the title of the form
   * @fields: Object with the field with the attributes:
   *   - name: Name for identifier the field in the id attribute
   *   - label: Label text
   *   - max: Max length
   *   - min: Min length
   *   - required: Require this input for submit
   *   - type: Input type
   *   - value: Value of input
   * */
  template: template,
  ui: {
    modal: '.modal',
    form: 'form#ui-form'
  },
  events: {
    'submit @ui.form': 'submitForm'
  },
  triggers: {
    'hidden.bs.modal @ui.modal': 'modalIsClose'
  },
  initialize: function () {
    /*
     * Validate options
     * */
    if (this.getOption('collection') !== undefined) {
      if (this.getOption('id') === undefined) {
        throw 'The modal view need the id of model';
      }
    }

    else if (this.getOption('model') === undefined) {
      throw 'The modal view need a model or collection';
    }

    if (this.getOption('title') === undefined) {
      throw 'The modal view need a title';
    }

    if (!this.getOption('fields').length) {
      throw 'The modal view need a fields';
    }
  },
  templateContext: function() {
    return {
      title: this.getOption('title'),
      fields: this.getOption('fields')
    }
  },
  onRender: function () {
    /*
     * Show modal
     * */
    this.getUI('modal').modal('show');
  },
  submitForm: function (event) {
    event.preventDefault();

    var values = this.getUI('form').serializeArray(),
        dict = {};

    _.each(values, function(value) {
      dict[value['name']] = value['value'];
    });
    
    if (this.collection) {
      this.collection.get(this.getOption('id')).set(dict).save();
    }
    else if (this.model) {
      this.model.set(dict).save();
    }

    this.getUI('modal').modal('hide');
  }
});