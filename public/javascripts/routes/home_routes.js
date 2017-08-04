var app = app || {};

app.ApplicationBasicRouter = Backbone.Marionette.AppRouter.extend({
  controller: app.ApplicationBasicController,
  appRoutes: {
    '': 'homePage',
    'auth': 'authenticationPage',
    'proyects': 'proyectsPage',
    'snippets': 'snippetsPage',
    'user/:id': 'profileUserPage'
  }
});