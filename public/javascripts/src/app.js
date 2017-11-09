require('./helpers/changeInterpolation')
require('./helpers/InputTag')

const Application = require('./application/AppExtend')
const GetConfigObject = require('./helpers/AppConfig')
const CurrentUser = require('./models/CurrentUser')
const ApplicationHeaderView = require('./views/HeaderView')
const ApplicationBasicRouter = require('./routes/BasicRouter')
const UserAuthRouter = require('./routes/AuthRouter')

const config = GetConfigObject()

const App = new Application(config)
const BasicRouterClass = ApplicationBasicRouter(App);
const AuthRouterClass = UserAuthRouter(App);

App.on('before:start', function () {
  this.current_user = new CurrentUser({
    name: this.options.name,
    email: this.options.email,
    id: this.options.id,
    permission_level: this.options.permission_level,
    image_profile: this.options.image_profile
  });
});

App.on('start', function() {
  var that = this;

  new ApplicationHeaderView({application: App});

  this.BasicRouter = new BasicRouterClass(App); // working in this
  
  Backbone.history.start();

  if (this.current_user.get_token()) {
    $.toast({
      heading: 'Loading...',
      text: 'Load user information. . .',
      icon: 'info',
      showHideTransition: 'slide',
      hideAfter: 3000
    });

    $.when(this.current_user.recovery()).done(function(response){
        that.current_user.set(response)
        that.AuthRouter = new AuthRouterClass(App);
    });
  }
});

var backboneSync = Backbone.sync;

// Send x-access-token in the header when the user are log
Backbone.sync = function (method, model, options) {
  /*
   * Check if user is login and get the token
   * If user authenticated send in the header the token
   * */
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