var app = app || {};

app.SnippetView = Mn.View.extend({
  template: '#container-snippet',
  regions: {
    commentsRegion: '#comments-region',
    createCommentRegion:'#createComment-region'
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
      idParent: this.snippet_id
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
  }
});

app.CommentsCollectionView = Mn.CollectionView.extend({
  className: 'row mt-3',
  initialize: function(options) {
    this.childView = Mn.View.extend({
      template: "#sub-view-comments",
      className: 'col-lg-12'
    });
    this.collection = new app.CommentCollection([], {
      modelParent: options.modelParent,
      idParent: options.idParent
    });
    this.collection.fetch();
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
  onRender: function () {
    /*
    * Add value to max attr of line number input
    * */
    this.getUI('numberInput').attr('max',
      this.getOption('editor_line_count')
    );
  },
  initialize: function () {
    this.model = app.current_user
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
      $.toast({
        heading: 'The comment is empty',
        text: 'Write more, lazy',
        icon: 'warning',
        showHideTransition: 'slide'
      });
      submit.attr('disabled', false);
      return false;
    } else {
      dict.body = text_area_value;
      dict.user_id = app.current_user.get('id');
      if (!titleInput.parent('div').hasClass('input-parent-visibility-hidden')
        && !$.trim(titleInput.val()) === false) {
          dict.title = titleInput.val();
        }
      if (!numberInput.parent('div').hasClass('input-parent-visibility-hidden')
        && !$.trim(numberInput.val()) === false) {
        dict.line_code = numberInput.val();
      }
      this.getOption('collection_comment').create(dict, {
        success: function () {
          $.toast({
            heading: 'Success!',
            text: 'Comment created successfully',
            icon: 'success',
            showHideTransition: 'slide'
          });
        },
        error: function () {
          app.toastError();
          submit.attr('disabled', false);
        }
      })
    }
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