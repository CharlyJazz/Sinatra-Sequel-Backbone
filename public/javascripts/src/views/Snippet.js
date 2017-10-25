const CreateCommentSnippetSubView = require('./snippet_subviews/CreateCommentSnippetSubView')
const CommentsCollectionSubView = require('./snippet_subviews/CommentsCollectionSubView')
const TagsSubView = require('./snippet_subviews/TagSubView')
const toastError = require('../helpers/toastConnectionError')
const messages = require('../../../../tmp/messages.json')

module.exports = Mn.View.extend({
  template: '#container-snippet',
  regions: {
    commentsRegion: '#comments-region',
    createCommentRegion: '#createComment-region',
    editModalRegion: '#modalEdit-region',
    tagsRegion: '#tags-region'
  },
  ui: {
    buttonWriteComment: '#ui-button-toggleForm',
    editButton: '.ui-edit',
    deleteButton: '.ui-delete',
    submitEditButton: '.ui-submit-edit',
    likeButton: '#ui-like-action',
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
    'click @ui.submitEditButton': 'submitEditSnippet',
    'click @ui.likeButton': 'toggleLike'
  },
  modelEvents: {
    'destroy': 'redirectToProfile',
    'invalid': function(model, error, options) {
      this.showToastInvalid(model, error, options);
      this.editor.setValue(model.get('body'));
      this.getUI('filenameInput').val(model.get('filename'));
    }
  },
  childViewEvents: {
    'modalIsClose': 'destroyModelView',
    'commentCreated': 'destroyCommentView'
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
        showCursorWhenSelecting:true,
        styleActiveLine: true,
        lineWrapping: true,
        readOnly: true
      });
      that.editor.setValue(that.model.get('body'))
    },1);

    this.renderComments();
    this.renderTags();
    this.renderLikes();

  },
  renderComments: function () {
    this.showChildView('commentsRegion', new CommentsCollectionSubView({
      modelParent: 'snippet',
      idParent: this.snippet_id,
      parent: this
    }));
  },
  renderTags: function () {
    this.showChildView('tagsRegion', new TagsSubView({
      idParent: this.snippet_id,
      idUserParent: this.model.get('user_id'),
      current_user: this.current_user
    }));
  },
  renderLikes: function () {
    var button = this.getUI('likeButton');
    $.when(this.model.getLikesCount()).then(function(data) {
      button.attr('data-likes', data.likes);
    });
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
  destroyCommentView: function () {
    this.getUI('buttonWriteComment')
      .addClass('right')
      .removeClass('left btn-warning')
      .html('<i class="fa fa-pencil"></i> Write a comment');

    var regionView = this.getChildView('createCommentRegion');
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
    /*
     * Validate file format and if the 
     * data entered is really different from the model
     * */
    this.getUI('card').removeClass('focus');
    this.getUI('headerInformation').removeClass('hidden-element');
    this.getUI('headerEditing').addClass('hidden-element');
    this.editor.setOption('readOnly', true);

    var filename = this.getUI('filenameInput').val().trim(),
        body = this.editor.getValue(),
        filenameUI = this.getUI('filename'),
        timestampUI = this.getUI('timestamp');

      if (this.model.get('filename') !== filename || this.model.get('body') !== body) {
        this.model.save({filename:filename, body: body}, {
          success: function (model) {
            filenameUI.text(model.get('filename'));
            timestampUI.text(jQuery.format.prettyDate(model.get('updated_at')));
          }
      });
    }
  },
  redirectToProfile: function () {
    this.getOption('application').BasicRouter.navigate('user/' + this.current_user.id , {trigger: true});
    $.toast({
      heading: 'Success',
      text: messages['snippet'].delete,
      icon: 'success',
      showHideTransition: 'slide'
    });
  },
  toggleLike: function () {
    var button = this.getUI('likeButton'),
        id_user = this.current_user.get('id');

    if (id_user) {
      $.when(this.model.createOrDeleteLike(id_user)).then(function(data) {
        button.attr('data-likes', data.likes);
      });
    } else {
      $.toast({
        heading: 'Ups...',
        text: messages['snippet'].like-without-auth,
        icon: 'info',
        showHideTransition: 'slide'
      });
    }
  },
  showToastInvalid: function (model, error, options) {
    $.toast({
      heading: 'Error!',
      text: error,
      icon: 'error',
      showHideTransition: 'slide'
    });
  }
});