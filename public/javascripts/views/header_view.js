var app = app || {};

app.ApplicationHeaderView = Mn.View.extend({
  el: '#navbar-application-menu',
  template: '#ul-navbar-application-menu',
  events: {
    'click a': 'navegate'
  },
  modelEvents: {
    'change:permission_level': 'render'
  },
  initialize: function(){
    this.model = app.current_user;
    this.render();
  },
  navegate: function(event) {
    $('.active').removeClass('active');
    $(event.target).parent().addClass('active');
  }
});

