var app = app || {};

app.TagCollection = Backbone.Collection.extend({
  model: app.Tag,
  url: '/api/tag/',
  search : function(letters){
    if(letters === '') return this;
    var pattern = new RegExp(letters, 'gi');
    return _(this.filter(function(data) {
      return pattern.test(data.get('name'));
    }));
  }
});