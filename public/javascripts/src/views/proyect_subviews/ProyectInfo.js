const template = require('../../../../../views/application_sub_views/proyect_info.erb');

module.exports = Mn.View.extend({
  template: template,
  modelEvents: {
  'change': 'render'
  }
});