const AuthRouterClass = require('../../routes/AuthRouter');
const messages = require('../../../../../tmp/messages.json');
const template = require('../../../../../views/application_sub_views/login.erb');

module.exports = Mn.View.extend({
  template: template,
  className: 'col-lg-6 offset-lg-3',
  regions: {
    login: '#login-region'
  },
  triggers: {
    'click a.switch': 'switch_register'
  },
  events: {
    'click @ui.submit': 'loginUser'
  },
  ui: {
    'submit': '#submit',
    'password_input': 'input#password',
    'email_input': 'input#email'
  },
  initialize: function () {
    this.application = this.getOption('application')
  },
  loginUser: function () {
    var password = this.getUI('password_input'),
        email = this.getUI('email_input'),
        that = this;

    if (password.val().length < 7) {
      $.toast({
        heading: 'Error',
        text: messages['user'].validation.password,
        icon: 'error',
        showHideTransition: 'slide'
      });
    }
    else {
      // Send ajax for login the user
      $.ajax({
        type: 'POST',
        url: '/auth/login',
        data: {
          'email': email.val(),
          'password': password.val()
        },
        dataType: 'json',
        success: function (response) {

          $.toast({
            heading: 'Welcome ' + response.username,
            text: messages['user'].login.success,
            icon: 'success',
            showHideTransition: 'slide',
            hideAfter: 1600
          });

          that.application.current_user.set({
            name: response.username,
            email: response.email,
            id: response.id,
            permission_level: response.permission_level,
            image_profile: response.image_profile
          });

          that.application.current_user.add_token(response.token);
          
          var AuthRouter = AuthRouterClass(that.application); // Get the object

          that.application.AuthRouter = new AuthRouter();

          Backbone.history.navigate(
            'user/' + that.application.current_user.get('id'), {trigger: true}
          );
        },
        error: function() {
          $.toast({
            heading: 'Error',
            text:  messages['user'].login.error,
            icon: 'error',
            showHideTransition: 'slide'
          });
        }
      });
    }
  }
});