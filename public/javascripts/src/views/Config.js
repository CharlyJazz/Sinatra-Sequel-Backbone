const RegisterSubView = require('./authentication_subviews/RegisterSubView')

module.exports = Mn.View.extend({
  template: '#container-authentication',
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