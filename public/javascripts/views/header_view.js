var app = app || {};

app.ApplicationHeaderView = Backbone.Marionette.View.extend({
  el: '#navbar-application-menu',
  template: _.template( $('#ul-navbar-application-menu').html() ),

  events: {
    'click a': 'navegate'
  },

  initialize: function(){

    this.render();

    if (app.current_user.is_authenticated()) {
      // Show correctly user functions dropdown menu :)
      console.log("Dropdown menu, with the Username and links")
    }
    else {
      this.$el.find('ul').append(
        '<li class="nav-item">' +
            '<a class="nav-link" href="#auth">Log in</a>' +
        '</li>'
      )
    }
  },

  navegate: function() {
    console.log(this)
  }

  
});