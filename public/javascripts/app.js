var Application = Marionette.Application.extend({

  /*  Options for the application configuration
        is_authenticated: true or false
        username: string that represent of name of the user
        permission_level: int that represent a Guest, User or Admin permission
  */

  onStart: function() {
    if (this.options.is_authenticated) {
      console.log('View Profile')
    } 
    else {
      console.log('View Auth')
    }

    Backbone.history.start();

  }

});