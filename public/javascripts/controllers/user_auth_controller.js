var app = app || {};

app.UserAuthController = {
  /*
  * Controller for the user authenticated
  *
  * All functions should validate that the user
  * are logged
  * */
  logoutUserAction: function(){
    /*
    * Update Current User attributes,
    * remove token and redirect to auth
    * */
    if (!app.current_user.is_authenticated()){
      return Backbone.history.navigate('auth', {trigger: true});
    }
    $.when(app.current_user.logout()).done(function(response){
      $.toast({
        heading: 'Good bye.',
        text: response.response,
        icon: 'success',
        showHideTransition: 'slide',
        hideAfter: 1600
      });
      app.current_user.set({
        username: false,
        email: false,
        id: false,
        permission_level: 0
      });
      // Remove current_user token
      app.current_user.remove_token();
      // Remove image profile
      window.localStorage.removeItem('image_profile');
      // Show toast
      Backbone.history.navigate('auth', {trigger: true});
    }).fail(function(){
      app.toastError(); // Show the toast error
    });
  },
  configUserPage: function () {
    /*
    * Show modal for update User
    * Information
    * */
    if (!app.current_user.is_authenticated()){
      return Backbone.history.navigate('auth', {trigger: true});
    }
    // var view = new app.UserConfigView();
    // view.render();
  },
  createProyectPage: function(){
    /*
    * Show modal for create Proyects
    * */
    if (!app.current_user.is_authenticated()){
      return Backbone.history.navigate('auth', {trigger: true});
    }
    var view = new app.CreateProyectsView();
    view.render();
  },
  createSnippetPage: function(){
    /*
    * Show modal for create Snippet
    * */
    if (!app.current_user.is_authenticated()){
      return Backbone.history.navigate('auth', {trigger: true});
    }
    var view = new app.CreateSnippetView();
    view.render();
  }
};