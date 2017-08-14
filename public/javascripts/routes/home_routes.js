var app = app || {};

app.ApplicationBasicRouter = Backbone.Marionette.AppRouter.extend({
  controller: app.ApplicationBasicController,
  appRoutes: {
    '': 'homePage',
    'auth': 'authenticationPage',
    'proyects': 'proyectsPage', // TODO: id opcional para ver proyect especifico
    'snippets': 'snippetsPage', // TODO: id opcional para ver snippet especifico
    'user/:id': 'profileUserPage'
  }
});