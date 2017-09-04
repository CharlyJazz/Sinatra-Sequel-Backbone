var app = app || {};

app.EditModalView = Mn.View.extend({
  /*
  * This modal if a multi use view
  * for edit a snippet, proyect, comment, or profile
  * */

  // https://mdbootstrap.com/javascript/modals/

  el: '#container-modal',
  template: '#modal-edit',
  onRender: function () {
    var fields = this.getOption('fields');
    /*
    * Render modal, and the inputs
    * */
  }
});