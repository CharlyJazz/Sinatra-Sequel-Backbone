var app = app || {};

app.AuthenticationView = Backbone.Marionette.View.extend({
  className: 'container',
  template: '#container-authentication',

  onRender: function() {
    $('main').append(this.$el);
  },

  // two regions: login and register

});