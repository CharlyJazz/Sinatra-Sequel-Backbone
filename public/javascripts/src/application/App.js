const ProgressBarView = require('../views/ProgressBar')
const CurrentUser = require('../models/CurrentUser')
const ApplicationHeaderView = require('../views/HeaderView')
const ApplicationBasicRouter = require('../routes/BasicRouter')
const UserAuthRouter = require('../routes/AuthRouter')

var BasicRouterClass, AuthRouterClass;

module.exports = Mn.Application.extend({
  region: 'main',
  initialize: function() {
    BasicRouterClass = ApplicationBasicRouter(this);
    AuthRouterClass = UserAuthRouter(this);
  },
  showAppRoute: function() {
    var that = this;
    /*
    *  Complete Progress Bar
    *  Create Basic Routes
    *  Activate Histoy
    */
    this.getRegion().currentView.completeProgressBar(function() {
      new ApplicationHeaderView({application: that});

      that.BasicRouter = new BasicRouterClass(that);

      Backbone.history.start();
    });  
  },
  onStart: function() {
    var that = this;
    /*
    * Check if the user is authenticated
    * Send request to server to recover user information
    * */
    this.showView(new ProgressBarView());
    this.current_user = new CurrentUser(); // Create unique CurrentUser instance

    if (this.current_user.get_token()) {
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
          that.AuthRouter = new AuthRouterClass(that);
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
        .always(function() {
          window.setTimeout(function() {
            toast.reset() // Remove toast
          }, 1000)
          that.showAppRoute();
        });
    }
    else {
      that.showAppRoute();
    }
  }
})