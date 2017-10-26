const LoginSubView = require('./authentication_subviews/LoginSubView');
const RegisterSubView = require('./authentication_subviews/RegisterSubView');
const template = require('../../../../views/application_views/auth.erb');

module.exports = Mn.View.extend({
  template: template,
  regions: {
    form: '#form-region'
  },
  childViewEvents: {
    'switch_register': 'renderRegister',
    'switch_login': 'renderLogin'
  },
  onRender: function() {
    this.renderLogin();
  },
  renderRegister: function() {
    this.showChildView('form', new RegisterSubView({
      mode: 'register'
    }));
  },
  renderLogin: function() {
    this.showChildView('form', new LoginSubView({
      application: this.getOption('application')
    }));
  }
});