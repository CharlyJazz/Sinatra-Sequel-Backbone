const RegisterSubView = require('./authentication_subviews/RegisterSubView')
const template = require('../../../../views/application_views/auth.erb');

module.exports = Mn.View.extend({
  template: template,
  regions: {
    form: '#form-region'
  },
  initialize: function (options) {
    this.application = options.application;
  },
  onRender: function() {
    this.showChildView('form', new RegisterSubView({
      mode: 'edit',
      model: this.application.current_user
    }));
  }
});