const Controller = require('../controllers/BasicController')

module.exports = function(application) {
  return Backbone.Marionette.AppRouter.extend({
    controller: Controller(application),
    appRoutes: {
      '': 'homePage',

      'auth': 'authenticationPage',

      'user/:id': 'profileUserPage',

      'user/:id/snippets': 'userSnippetsPage',

      'snippets': 'snippetsPage',

      'snippets/:id': 'snippetsPage',
    }
  })
}