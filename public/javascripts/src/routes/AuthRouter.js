const Controller = require('../controllers/AuthController')

module.exports = function(application) {
  return Backbone.Marionette.AppRouter.extend({
    controller: Controller(application),
    appRoutes: {
      'logout': 'logoutUserAction',

      'config': 'configUserPage',

      'create/snippet': 'createSnippetPage',

      'create/proyect': 'createProyectPage'
    },
    initialize: function () {
      // Redirect to the profile of user logged
      Backbone.history.navigate(
        'user/' + application.current_user.get('id'), {trigger: true}
      );
    }
  })
}