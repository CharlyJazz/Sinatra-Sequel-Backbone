var app = app || {};

app.HomeView = Backbone.Marionette.View.extend({
  
  className: 'container',
  template: '#container-home',

  onRender: function() {
    $('main').append(this.$el);
  },

});