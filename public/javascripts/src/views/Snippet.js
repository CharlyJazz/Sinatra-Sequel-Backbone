const CreateCommentSnippetSubView = require('./snippet_subviews/CreateCommentSnippetSubView')
const CommentsCollectionSubView = require('./snippet_subviews/CommentsCollectionSubView')

module.exports = Mn.View.extend({
  template: '#container-snippet',
  regions: {
    commentsRegion: '#comments-region',
    createCommentRegion: '#createComment-region',
    editModalRegion: '#modalEdit-region'
  },
  ui: {
    buttonWriteComment: '#ui-button-toggleForm'
  },
  events: {
    'click @ui.buttonWriteComment': 'toggleRenderFormComment'
  },
  modelEvents: {
    'sync': 'renderComments'
  },
  childViewEvents: {
    'modalIsClose': 'destroyModelView'
  },
  initialize: function () {
    this.snippet_id = this.model.id;
    this.current_user = this.getOption('application').current_user;
  },
  onRender: function () {
    var that = this;
    setTimeout(function() {
      that.editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'railscasts',
        showCursorWhenSelecting:true,
        styleActiveLine: true,
        lineWrapping: true,
        readOnly: true
      });
      that.editor.setValue(that.model.get('body'))
    },1);
  },
  renderComments: function () {
    this.showChildView('commentsRegion', new CommentsCollectionSubView({
      modelParent: 'snippet',
      idParent: this.snippet_id,
      parent: this
    }));
  },
  toggleRenderFormComment: function () {
    var regionView = this.getChildView('createCommentRegion');
    if (regionView) {
      this.getUI('buttonWriteComment')
        .addClass('right')
        .removeClass('left btn-warning')
        .html('<i class="fa fa-pencil"></i> Write a comment');
      regionView.destroy();
    } else {
      this.getUI('buttonWriteComment')
        .addClass('left btn-warning')
        .removeClass('right')
        .html('<i class="fa fa-window-close"></i> Cancel');
      this.showChildView('createCommentRegion',
        new CreateCommentSnippetSubView({
          snippet_id: this.model.get('id'),
          editor_line_count: this.editor.lineCount(),
          collection_comment: this.getChildView('commentsRegion').collection,
          current_user: this.current_user
        })
      );
    }
  },
  destroyModelView: function () {
    var regionView = this.getChildView('editModalRegion');
    regionView.destroy();
  }
});