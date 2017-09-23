module.exports = Backbone.Model.extend({
  initialize: function(options){
    if (typeof(options.snippet_id) === "number") {
      this.snippet_id = options.snippet_id ;
    }
    else {
      throw 'The model SnippetTag need the Snippet id'
    }
  },
  urlRoot: function(){
    return '/api/snippet/' + this.snippet_id + '/tag';
  }
});
