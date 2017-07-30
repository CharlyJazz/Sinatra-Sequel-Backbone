var app = app || {};

app.ApplicationHomeController = {
  home: function(){
    // Default url of the app, welcome content
      var view = new app.HomeView();
      view.render();
  },
  authentication: function(){
    // Authentication url, login or register
      var view = new app.AuthenticationView();
      view.render();
  },
  profile: function(){
    // If user authenticated then show the profile
      var view = new app.ProfileView();
      view.render();
  },
};