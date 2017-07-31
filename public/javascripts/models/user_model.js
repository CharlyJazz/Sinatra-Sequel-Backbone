var app = app || {};

app.User = Backbone.Model.extend({
  urlRoot: '/api/user/'
  // defaults:{
  //   name: '',
  //   email: '',
  //   image_profile: '',
  //   password: '',
  //   password_confirmation: ''
  // }
});