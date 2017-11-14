const Controller = require('../controllers/AuthController')

module.exports = function(application) {
  return Backbone.Marionette.AppRouter.extend({
    controller: Controller(application),
    appRoutes: {
      'logout': 'logoutUserAction',

      'config': 'configUserPage',

      'create/snippet': 'createSnippetPage',

      'create/proyect': 'createProyectPage'
    }
  })
}