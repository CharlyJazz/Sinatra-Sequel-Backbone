const LoginSubView = require('./authentication_subviews/LoginSubView')
const RegisterSubView = require('./authentication_subviews/RegisterSubView')

module.exports = Mn.View.extend({
  template: '#container-authentication',
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