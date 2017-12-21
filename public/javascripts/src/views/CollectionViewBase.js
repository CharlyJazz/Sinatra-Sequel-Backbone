const loadingTemplate = require('../../../../views/application_sub_views/spinner.erb');

module.exports = Mn.CollectionView.extend({
  emptyView: Mn.View.extend({
    template: loadingTemplate
  })
});