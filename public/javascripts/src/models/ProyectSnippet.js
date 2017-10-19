module.exports = Backbone.Model.extend({
  /*
  * Model for create relation between Proyect and the Snippets
  *
  * Attr:
  *   - proyect_id: Proyect id
  *   - snippets_id: Array of id
  * */
  initialize: function(options) {
    if (!isNaN(options.proyect_id)) {
      this.proyect_id = options.proyect_id;
    }
    else {
      throw 'The model ProyectSnippet need the Proyect id'
    }
    if (!_.isArray(options.proyect_id) && !options.proyect_id.length) {
      this.snippets_id = options.snippets_id.toString();
    }
    else {
      throw 'The model ProyectSnippet need the array with the Snippets id'
    }
  },
  urlRoot: function() {
    return '/api/proyect/' + this.proyect_id + '/snippet/' + this.snippets_id;
  }
});
