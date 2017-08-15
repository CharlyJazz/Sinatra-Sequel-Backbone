var app = app || {};

app.ApplicationBasicRouter = Backbone.Marionette.AppRouter.extend({
  controller: app.ApplicationBasicController,
  appRoutes: {
    '': 'homePage',

    'auth': 'authenticationPage',

    'proyects': 'proyectsPage',

    'proyects/:id': 'proyectsPage',

    'snippets': 'snippetsPage',

    'snippets/:id': 'snippetsPage',

    'user/:id': 'profileUserPage'
  }
});