var app = app || {};

app.Application = Marionette.Application.extend({

  onStart: function() {
    // Current user authenticated or guest
    // Very Important for the render of the header
    app.current_user = new app.CurrentUser({
      username: this.options.username,
      email: this.options.email,
      id: this.options.id,
      permission_level: this.options.permission_level
    });

    new app.ApplicationHeaderView

    new app.ApplicationPagesRouter;
  
    Backbone.history.start();        
    
  }
    
});