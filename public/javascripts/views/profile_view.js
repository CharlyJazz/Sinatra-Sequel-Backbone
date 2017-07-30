var app = app || {};

app.ProfileView = Backbone.Marionette.View.extend({
  className: 'container',
  template: '#container-profile',

  onRender: function() {
    $('main').append(this.$el);
  },
  
});