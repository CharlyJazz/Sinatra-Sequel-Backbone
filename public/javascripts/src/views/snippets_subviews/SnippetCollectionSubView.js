module.exports = Mn.CollectionView.extend({
  className: 'row mt-3',
  initialize: function() {
    this.childView = Mn.View.extend({
      template: "#sub-view-snippet-all",
      className: 'col-lg-6 box_snippet_preview'
    });
    this.collection.fetch({
      success: function () {
        prettyPrint() // Code Prettify
      }
    });
  }
});