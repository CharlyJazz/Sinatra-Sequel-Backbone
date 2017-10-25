const ModalChoiceCreate = require('../views/ModalChoiceCreate')

module.exports = Mn.View.extend({
  el: '#navbar-application-menu',
  template: '#ul-navbar-application-menu',
  regions: {
    createModalRegion: '#modalCreate-region'
  },
  events: {
    'click a': 'navegate',
    'click a#button-create': 'renderModalChoice'
  },
  childViewEvents: {
    'modalIsClose': 'destroyModalChoice'
  },
  modelEvents: {
    'change:permission_level': 'render',
    'change:name': 'render'
  },
  initialize: function(){
    this.model = this.getOption('application').current_user
    this.render()
  },
  navegate: function(event) {
    $('.active').removeClass('active')
    $(event.target).parent().addClass('active')
  },
  renderModalChoice: function () {
    this.showChildView('createModalRegion', new ModalChoiceCreate({
      application: this.getOption('application')
    }))
  },
  destroyModalChoice: function() {
    var regionView = this.getChildView('createModalRegion');
    regionView.destroy();
  }
});