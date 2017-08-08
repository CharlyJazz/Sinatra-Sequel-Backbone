var app = app || {};

app.UserAuthRouter = Backbone.Marionette.AppRouter.extend({
  controller: app.UserAuthController,
  appRoutes: {
    'logout': 'logoutUserAction',
    'config': 'configUserPage',
    'create/snippet': 'createSnippetPage',
    'create/proyect': 'createProyectPage'
  },
  initialize: function () {
    // Redirect to the profile of user logged
    Backbone.history.navigate(
      'user/' + app.current_user.get('id'), {trigger: true}
    );
  }
});