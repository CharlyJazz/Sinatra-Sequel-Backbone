const template_loading = require('../../../../views/application_views/loading.erb')

module.exports =  Mn.View.extend({
  template: template_loading,
  ui: {
    bar: '.progress-bar'
  },
  completeProgressBar: function(callbackSuccess) {
    this.getUI('bar').animate({
      width: "100%"
    }, 2500, function(){
      callbackSuccess()
    });
  }
})