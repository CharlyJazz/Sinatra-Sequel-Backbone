const HomeView = require('../views/Home')
const AuthenticationView = require('../views/Authentication')
const ProfileView = require('../views/Profile')
const SnippetView = require('../views/Snippet')
const SnippetsView = require('../views/Snippets')
const ProyectView = require('../views/Proyect')
const ProyectsView = require('../views/Proyects')
const User = require('../models/User')
const Snippet = require('../models/Snippet')
const Proyect = require('../models/Proyect')
const Snippets = require('../collections/Snippets')
const UserSnippets = require('../collections/UserSnippetsCollection')
const Proyects = require('../collections/Proyects')
const UserProyects = require('../collections/UserProyectsCollection')

module.exports = function(application) {
  return {
    homePage: function() {
      application.showView(new HomeView());
    },
    authenticationPage: function() {
      if (application.current_user.is_authenticated()){
        return Backbone.history.navigate(
          'user/' + application.current_user.get('id'), {trigger: true}
        );
      }

      application.showView(new AuthenticationView({
        application: application
      }));
    },
    profileUserPage: function(id) {
      if (!isNaN(id)) {
        var userModel = new User({id: id});
        var myView = new ProfileView({
          model: userModel
        });
        userModel.on("sync", function () {
          application.showView(myView);
        });
        userModel.fetch();
      }
    },
    userSnippetsPage: function (id) {
      if (!isNaN(id)) {
        application.showView(
          new SnippetsView({
            collection: new UserSnippets([],{
              user_id: id
            })
          })
        );
      }
    },
    snippetsPage: function(id) {
      if (typeof(id) === 'object') {
        application.showView(
          new SnippetsView({
            collection: new Snippets([], {})
          })
        );
      }
      else if (!isNaN(id)) {
        var snippetModel = new Snippet({id:id});
        var myView = new SnippetView({
          model: snippetModel,
          application: application
        });
        snippetModel.on('sync', function() {
          application.showView(myView);
        });
        snippetModel.fetch({
          error: function () {
            $.toast({
              heading: 'Wow!',
              text: 'This page does not exist',
              icon: 'error',
              showHideTransition: 'slide'
            });
            Backbone.history.navigate('snippets', {trigger: true});
          }
        });
      }
    },
    userProyectsPage: function(id) {
      if (!isNaN(id)) {
        application.showView(
          new ProyectsView({
            collection: new UserProyects([],{
              user_id: id
            })
          })
        );
      }
    },
    proyectsPage: function(id) {
      if (typeof(id) === 'object') {
        application.showView(
          new ProyectsView({
            collection: new Proyects([], {})
          })
        );
      }
      else if (!isNaN(id)) {
        var proyectModel = new Proyect({id:id});
        var myView = new ProyectView({
          model: proyectModel,
          application: application
        });
        proyectModel.on('sync', function() {
          application.showView(myView);
        });
        proyectModel.fetch({
          error: function () {
            $.toast({
              heading: 'Wow!',
              text: 'This page does not exist',
              icon: 'error',
              showHideTransition: 'slide'
            });
            Backbone.history.navigate('proyects', {trigger: true});
          }
        });
      }
    }
  }
};