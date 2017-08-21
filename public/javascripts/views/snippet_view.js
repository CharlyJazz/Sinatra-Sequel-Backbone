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
        new app.CreateCommentSnippet({snippet_id: this.model.get('id')})
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
    submit: '#submit'
  },
  events: {
    'click @ui.submit': 'createComment'
  },
  initialize: function () {
    this.model = app.current_user
  },
  createComment: function () {
    /*
    * Validate comment and save TODO
    * */
  }
});