var app = app || {};

app.SnippetView = Mn.View.extend({
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
    this.showChildView('commentsRegion', new app.CommentsCollectionView({
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
        new app.CreateCommentSnippet({
          snippet_id: this.model.get('id'),
          editor_line_count: this.editor.lineCount(),
          collection_comment: this.getChildView('commentsRegion').collection
        })
      );
    }
  },
  destroyModelView: function () {
    var regionView = this.getChildView('editModalRegion');
    regionView.destroy();
  }
});

app.CommentsCollectionView = Mn.CollectionView.extend({
  className: 'row mt-3',
  ui: {
    editButton: '.ui-edit',
    deleteButton: '.ui-delete'
  },
  events: {
    'click @ui.editButton': 'toggleModal',
    'click @ui.deleteButton': 'deleteComment'
  },
  collectionEvents: {
    'change': 'render'
  },
  initialize: function(options) {
    this.parent = options.parent;
    this.modal = undefined;
    this.childView = Mn.View.extend({
      template: "#sub-view-comments",
      className: 'col-lg-12',
      templateContext: function() {
        return {
          user_authenticated_is_the_owner: function(id_user) {
            return app.current_user.is_authenticated() && app.current_user.get('id') == id_user
          }
        }
      }
    });
    this.collection = new app.CommentCollection([], {
      idParent: options.idParent
    });
    this.collection.fetch();
  },
  toggleModal: function (event) {
    var id = $(event.currentTarget).data("id"),
        item = this.collection.get(id);

    this.parent.showChildView('editModalRegion', new app.EditModalView({
      id: id,
      collection: this.collection,
      title: 'Edit your comment',
      fields: [
        {
          name: 'title',
          label: 'The title',
          value: item.get('title'),
          type: 'text',
          max: 120,
          required: false
        },
        {
          name:'body',
          label: 'The text body',
          value: item.get('body'),
          type: 'textarea',
          max: 24,
          required: true
        },
        {
          name: 'line_code',
          label: 'The line in the code editor',
          value: item.get('line_code'),
          type: 'number',
          max: this.parent.editor.lineCount(),
          required: false
        }
      ]
    }));
  },
  deleteComment: function (event) {
    this.collection.get(event.currentTarget.dataset.id).destroy()
  }
});

app.CreateCommentSnippet = Mn.View.extend({
  template: '#sub-view-create-comment',
  className: 'row',
  ui: {
    submit: '#submit',
    form: 'form',
    buttonHideTitleInput: '#ui-button-hide-title',
    buttonHideLineNumberInput: '#ui-button-hide-line-number',
    numberInput: '#line-number',
    titleInput: '#title-comment',
    textarea: '#textarea-comment'
  },
  events: {
    'click @ui.buttonHideTitleInput': 'toggleDisabledInput',
    'click @ui.buttonHideLineNumberInput': 'toggleDisabledInput',
    'click @ui.submit': 'createComment'
  },
  templateContext: function() {
    /*
     The templateContext object can also be a function
     returning an object. This is useful when you want
     to access information from the surrounding view (e.g. model methods).
     */
    return {
      image_profile: app.current_user.get('image_profile'),
      permission_level: app.current_user.get('permission_level')
    }
  },
  onRender: function () {
    /*
     * Add value to max attr of line number input
     * */
    this.getUI('numberInput').attr('max',
      this.getOption('editor_line_count')
    );
  },
  initialize: function () {
    this.collection = this.getOption('collection_comment');
  },
  createComment: function () {
    /*
     * Check if the title or number input are disable
     * Validate comment, save and add to Collection View
     * */
    var text_area_value = this.getUI('textarea').val(),
      titleInput = this.getUI('titleInput'),
      numberInput = this.getUI('numberInput'),
      submit = this.getUI('submit'),
      dict = {};
    submit.attr('disabled', true);
    if (!$.trim(text_area_value)) { // Support IE8-
      this.toastInvalidComment();
      submit.attr('disabled', false);
      return false;
    } else {
      /*
       * Create model, save and add to collection
       * */
      dict.body = text_area_value;
      dict.user_id = app.current_user.get('id');
      dict.user_name = app.current_user.get('username');
      dict.user_picture = app.current_user.get('image_profile').call();
      if (!titleInput.parent('div').hasClass('input-parent-visibility-hidden')
        && !$.trim(titleInput.val()) === false) {
        dict.title = titleInput.val();
      }
      if (!numberInput.parent('div').hasClass('input-parent-visibility-hidden')
        && !$.trim(numberInput.val()) === false) {
        dict.line_code = numberInput.val();
      }
      /**
       * Prevent Bug with wait true
       * https://stackoverflow.com/questions/11659012/how-to-get-the-id-when-i-create-a-save-a-new-model
       */
      this.collection.create(dict, {
        wait: true
      });
      this.toastCreateComment();
    }
  },
  toastInvalidComment: function () {
    $.toast({
      heading: 'The comment is empty',
      text: 'Write more, lazy',
      icon: 'warning',
      showHideTransition: 'slide'
    });
  },
  toastCreateComment: function () {
    $.toast({
      heading: 'Success!',
      text: 'Comment created successfully',
      icon: 'success',
      showHideTransition: 'slide'
    });
  },
  toggleDisabledInput: function (event) {
    // Toggle show / hidden input parent node except the button
    var target = $(event.target),
      targetParentNode = $(event.target.previousSibling.parentNode);
    if (target.hasClass('fa-plus-circle')) {
      $(targetParentNode).removeClass('input-parent-visibility-hidden');
      target.removeClass('fa-plus-circle').addClass('fa-times-circle')
    } else {
      $(targetParentNode).addClass('input-parent-visibility-hidden');
      target.addClass('fa-plus-circle').removeClass('fa-times-circle')
    }
  }
});