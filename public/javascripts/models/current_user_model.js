var app = app || {};

app.CurrentUser = Backbone.Model.extend({
    // Current user using the appication
    defaults:{
        username: false,
        email: false,
        id: false,
        permission_level: 0
    },

    is_authenticated: function() {
      if (this.get('permission_level') === 0) {
        return false
      }
      else {
        return true
      }
    }

});