var app = app || {};

app.ProfileView = Mn.View.extend({
  el: 'main',
  template: '#container-profile',
  initialize: function () {
    var self = this;
    this.model.fetch({
      success: function (response) {
        self.render();
      }
    });
  }
});