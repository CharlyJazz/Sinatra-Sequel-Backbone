var app = app || {};

app.ApplicationBasicController = {
  homePage: function(){
    var view = new app.HomeView();
    view.render();
  },
  authenticationPage: function(){
    if (app.current_user.is_authenticated()){
      return Backbone.history.navigate(
        'user/' + app.current_user.get('id'), {trigger: true}
        );
    }
    var view = new app.AuthenticationView();
    view.render();
  },
  proyectsPage: function(){
    var view = new app.ProyectsView();
    view.render();
  },
  snippetsPage: function(){
    var view = new app.SnippetsView();
    view.render();
  },
  profileUserPage: function(id){
    var view = new app.ProfileView();
    view.render();
  }
};