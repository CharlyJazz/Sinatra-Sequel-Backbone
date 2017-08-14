var app = app || {};

app.ApplicationBasicController = {
  homePage: function(){
    app.CurrentApplication.showView(new app.HomeView());
  },
  authenticationPage: function(){
    if (app.current_user.is_authenticated()){
      return Backbone.history.navigate(
        'user/' + app.current_user.get('id'), {trigger: true}
      );
    }
    app.CurrentApplication.showView(new app.AuthenticationView());
  },
  proyectsPage: function(){
    app.CurrentApplication.showView(new app.ProyectsView());
  },
  snippetsPage: function(){
    app.CurrentApplication.showView(new app.SnippetsView());
  },
  profileUserPage: function(id){
    var userModel = new app.User({id:id});
    var myView = new app.ProfileView({
      model: userModel
    });
    userModel.on("sync", function(){
      app.CurrentApplication.showView(myView);
    });
    userModel.fetch();
  }
};