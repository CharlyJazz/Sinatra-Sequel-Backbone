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
  proyectsPage: function(id){
    // TODO: test and refactor
    if(typeof(id) === "number") {
      var proyectModel = new app.Proyect({id:id});
      var myView = new app.ProyectView({
        model: proyectModel
      });
      proyectModel.on("sync", function(){
        app.CurrentApplication.showView(myView);
      });
      proyectModel.fetch();
    } else {
      var proyectCollection = new app.Proyect();
      var myView = new app.ProyectView({
        collection: proyectCollection
      });
      proyectCollection.on("sync", function(){
        app.CurrentApplication.showView(myView);
      });
      proyectCollection.fetch();
    }
  },
  snippetsPage: function(id){
    if (typeof(id) === 'object') {
      app.CurrentApplication.showView(
        new app.SnippetsView({
          collection: new app.SnippetCollection([],{
            page:1
          })
        })
      );
    } else if(!isNaN(id)) {
      var snippetModel = new app.Snippet({id:id});
      var myView = new app.SnippetView({
        model: snippetModel
      });
      snippetModel.on("sync", function(){
        app.CurrentApplication.showView(myView);
      });
      snippetModel.fetch({
        error: function () {
          $.toast({
            heading: 'Wow!',
            text: 'This page does not exist',
            icon: 'error',
            showHideTransition: 'slide'
          });
          Backbone.history.navigate(
            'snippets', {trigger: true}
          );
        }
      });
    }
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