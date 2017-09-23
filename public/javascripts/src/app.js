require('./helpers/changeInterpolation')
require('./helpers/InputTag')

const Application = require('./application/AppExtend')
const GetConfigObject = require('./helpers/AppConfig')
const CurrentUser = require('./models/CurrentUser')
const ApplicationHeaderView = require('./views/HeaderView')
const ApplicationBasicRouter = require('./routes/BasicRouter')
const UserAuthRouter = require('./routes/AuthRouter')

const config = GetConfigObject()

let App = new Application(config)

const BasicRouterClass = ApplicationBasicRouter(App);
const AuthRouterClass = UserAuthRouter(App);

App.on('before:start', function () {
  this.current_user = new CurrentUser({
    username: this.options.username,
    email: this.options.email,
    id: this.options.id,
    permission_level: this.options.permission_level
  })
});

App.on('start', function() {
  new ApplicationHeaderView({application: App})

  this.BasicRouter = new BasicRouterClass(App) // working in this

  if (this.options.permission_level > 0) {
    this.AuthRouter = new AuthRouterClass(App)
  }

  Backbone.history.start()
});

var backboneSync = Backbone.sync;

// Send x-access-token in the header when the user are log
Backbone.sync = function (method, model, options) {
  /*
   * Check if user is login and get the token
   * If user authenticated send in the header the token
   * */
  let token = App.current_user.get_token();
  if (token) {
    options.headers = {
      'x-access-token': token
    }
  }
  backboneSync(method, model, options);
};

document.addEventListener('DOMContentLoaded', function() {
  App.start();
});