var app = app || {};

app.ApplicationPagesRouter = Backbone.Marionette.AppRouter.extend({
  controller: app.ApplicationHomeController,
  appRoutes: {
    '': 'home',
    'auth': 'authentication',
    'profile': 'profile' // TODO id of user
  }
});