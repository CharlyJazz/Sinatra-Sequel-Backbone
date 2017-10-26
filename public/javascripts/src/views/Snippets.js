const Collection = require('./snippets_subviews/SnippetCollectionSubView')
const template = require('../../../../views/application_views/snippets.erb')

module.exports = Mn.View.extend({
  template: template,
  regions: {
    snippetsRegion: '#snippets'
  },
  /*
  * Counter of pages
  * */
  page: 1,
  /*
  * When the ajax that brings the snippet gives
  * 404 means that there are no more snippets and
  * this variable prevents further creation of ajax
  * */
  page_final_viewed: false,
  initialize: function() {
    /*
    * Create object that extend of Backbone.Events
    * for listen the scroll event
    * */
    var that = this;

    this.ObjectEventScroll = {};

    _.extend(this.ObjectEventScroll , Backbone.Events);

    this.ObjectEventScroll.on('scrolling', function(){
      that._checkIfBottomPage();
    });

    $(window).scroll(function(){
      that.ObjectEventScroll.trigger('scrolling')
    });
  },
  _checkIfBottomPage: function () {
    var that = this;
    if (this.page_final_viewed == false) {
      if($(window).scrollTop() + $(window).height() == $(document).height()) {
        this.collection.update_url(this.page + 1);
        this.collection.fetch({
          remove: false,
          success: function () {
            that.page = that.page + 1;
            prettyPrint() // Code Prettify
          },
          error: function () {
            that._unBindScroll();
            that.page_final_viewed = true;
          }
        });
      }
    }
  },
  onBeforeDestroy: function () {
    this._unBindScroll();
  },
  onRender: function () {
    this.renderSnippets();
  },
  _unBindScroll: function () {
    this.ObjectEventScroll.off('scrolling');
    $(window).unbind('scroll');
  },
  renderSnippets: function () {
    this.showChildView('snippetsRegion', new Collection({
      collection: this.collection
    }));
  }
});