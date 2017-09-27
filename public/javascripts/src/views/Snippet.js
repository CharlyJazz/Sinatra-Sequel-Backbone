const CreateCommentSnippetSubView = require('./snippet_subviews/CreateCommentSnippetSubView')
const CommentsCollectionSubView = require('./snippet_subviews/CommentsCollectionSubView')
const toastError = require('../helpers/toastConnectionError')

module.exports = Mn.View.extend({
  template: '#container-snippet',
  regions: {
    commentsRegion: '#comments-region',
    createCommentRegion: '#createComment-region',
    editModalRegion: '#modalEdit-region',
  },
  ui: {
    buttonWriteComment: '#ui-button-toggleForm',
    editButton: '.ui-edit',
    deleteButton: '.ui-delete',
    submitEditButton: '.ui-submit-edit',
    headerInformation: '.snippet_information',
    headerEditing: '.snippet_editing',
    filenameInput: 'input#filename',
    filename: 'span.snippet_filename',
    timestamp: 'span.snippet_timestamp',
    card: '.card'
  },
  events: {
    'click @ui.buttonWriteComment': 'toggleRenderFormComment',
    'click @ui.editButton': 'editSnippet',
    'click @ui.deleteButton': 'deleteSnippet',
    'click @ui.submitEditButton': 'submitEditSnippet'
  },
  modelEvents: {
    //'change:body': 'updateEditorValue'
  },
  childViewEvents: {
    'modalIsClose': 'destroyModelView'
  },
  initialize: function () {
    this.snippet_id = this.model.id;
    this.current_user = this.getOption('application').current_user;
  },
  templateContext: function() {
    var that = this;
    return {
      user_authenticated_is_the_owner: function(id_user) {
        return that.current_user.is_authenticated() && that.current_user.get('id') == id_user
      }
    }
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
    this.renderComments();
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
  },
  deleteSnippet: function () {
    this.model.destroy();
  },
  editSnippet: function () {
    this.getUI('card').addClass('focus');
    this.getUI('headerInformation').addClass('hidden-element')
    this.getUI('headerEditing').removeClass('hidden-element')
    this.editor.setOption('readOnly', false);
  },
  submitEditSnippet: function () {
    this.getUI('card').removeClass('focus');
    this.getUI('headerInformation').removeClass('hidden-element')
    this.getUI('headerEditing').addClass('hidden-element')
    this.editor.setOption('readOnly', true);

    var filename = this.getUI('filenameInput').val(),
        body = this.editor.getValue(),
        filenameUI = this.getUI('filename'),
        timestampUI = this.getUI('timestamp');

    this.model.save({filename:filename, body: body}, {
      success: function (model) {
        filenameUI.text(model.get('filename'));
        timestampUI.text(jQuery.format.prettyDate(model.get('updated_at')));
      },
      error: function () {
        toastError();
      }
    });
  }
});