var app = app || {};

app.ApplicationHeaderView = Backbone.Marionette.View.extend({
  el: '#navbar-application-menu',
  template: '#ul-navbar-application-menu',
  events: {
    'click a': 'navegate'
  },
  initialize: function(){
    this.render();
    if (app.current_user.is_authenticated()) {
      /*
      * Show the user menu if authenticated
      * Create Snippet, Create Proyect and Config Profile
      * */
      console.log("Dropdown menu, with the Username and links")
    }
    else {
      /*
      * If the user are guest then append a menu option
      * for authentication
      * */
      this.$el.find('ul').append(
        '<li class="nav-item">' +
            '<a class="nav-link" href="#auth">Log in</a>' +
        '</li>'
      )
    }
    $("a.navbar-brand").click(function(){
      $('.active').removeClass('active');
      $('#navbar-application-menu').find('ul > li:first').addClass('active');
    });
  },
  navegate: function(event) {
    $('.active').removeClass('active');
    $(event.target).parent().addClass('active');
  }
});