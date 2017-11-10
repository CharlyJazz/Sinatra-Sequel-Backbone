require('./helpers/changeInterpolation')
require('./helpers/InputTag')

const Application = require('./application/AppExtend')
const CurrentUser = require('./models/CurrentUser')
const ApplicationHeaderView = require('./views/HeaderView')
const ApplicationBasicRouter = require('./routes/BasicRouter')
const UserAuthRouter = require('./routes/AuthRouter')

const App = new Application()

const BasicRouterClass = ApplicationBasicRouter(App);
const AuthRouterClass = UserAuthRouter(App);

App.on('start', function() {
  var that = this;
  
  this.current_user = new CurrentUser(); // Create unique CurrentUser instance

  new ApplicationHeaderView({application: App}); // Active Header

  this.BasicRouter = new BasicRouterClass(App); // Active basic routes

  Backbone.history.start();

  if (this.current_user.get_token()) {
    /*
    * Try recovery user information if the token no expired yet
    */
    var toast = $.toast({
      heading: 'Loading...',
      text: 'Load user information. . .',
      icon: 'info',
      showHideTransition: 'slide',
      hideAfter: false
    });

    $.when(this.current_user.recovery())
      .done(function(response) {
        that.current_user.set(response)
        that.AuthRouter = new AuthRouterClass(App);
        toast.update({hideAfter: 1000})
      })
      .fail(function(response) {
        if (response.status === 401) {
          window.setTimeout(function() {

            that.current_user.remove_token();

            Backbone.history.navigate('auth', {trigger: true});
            
            toast.update({
              heading: 'Sorry, you need login',
              text: 'Write your email and password',
              icon: 'error',
              showHideTransition: 'slide',
              hideAfter: 1000
            });
          }, 1000);
        }
      })
      .always(function(){
        window.setTimeout(function() {
          toast.reset() // Remove toast
        }, 1000)
      });
  }
});

var backboneSync = Backbone.sync;

// Send token in the request header if exist
Backbone.sync = function (method, model, options) {
  var token = App.current_user.get_token();

  if (token) {
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer '.concat(token))
    }
  }

  backboneSync(method, model, options);
};

document.addEventListener('DOMContentLoaded', function() {
  App.start();
});