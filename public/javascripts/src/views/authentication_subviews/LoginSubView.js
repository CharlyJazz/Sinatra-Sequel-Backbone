const AuthRouterClass = require('../../routes/AuthRouter')

module.exports = Mn.View.extend({
  template: '#sub-view-login',
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
        heading: 'Password very tiny!',
        text: 'The password no is correct',
        icon: 'warning',
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

          // Show toast
          $.toast({
            heading: 'Welcome ' + response.username,
            text: 'Wait while loading your profile',
            icon: 'success',
            showHideTransition: 'slide',
            hideAfter: 1600
          });

          // Update current_user attributes
          that.application.current_user.set({
            name: response.username,
            email: response.email,
            id: response.id,
            permission_level: response.permission_level,
            image_profile: response.image_profile
          });

          // Update current_user token
          that.application.current_user.add_token(response.token);

          // Active User Auth Routes and redirect to the profile
          const AuthRouter = AuthRouterClass(that.application) // Get the object
          that.application.AuthRouter = new AuthRouter();

        },
        error: function() {
          $.toast({
            heading: 'The data does not match',
            text: 'Make sure your password and mail with the correct ones',
            icon: 'error',
            showHideTransition: 'slide'
          });
        }
      });
    }
  }
});