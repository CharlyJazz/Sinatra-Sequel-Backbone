module.exports = Mn.View.extend({
  template: '#container-proyect',
  regions: {
    commentsRegion: '#comments-region',
    createCommentRegion: '#createComment-region',
    editModalRegion: '#modalEdit-region',
    snippetsRegion: '#snippets-region'
  },
  ui: {
    likeButton: '#ui-like-action'
  },
  events: {
    'click @ui.likeButton': 'toggleLike'
  },
  modelEvents: {
    'destroy': 'redirectToProfile',
    'invalid': function(model, error, options) {
      this.showToastInvalid(model, error, options);
    }
  },
  childViewEvents: {
    'modalIsClose': 'destroyModelView',
    'commentCreated': 'destroyCommentView'
  },
  initialize: function () {
    this.proyect_id = this.model.id;
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
    this.renderLikes();
  },
  renderSnippets: function () {

  },
  renderLikes: function () {
    var button = this.getUI('likeButton');
    $.when(this.model.getLikesCount()).then(function(data) {
      button.attr('data-likes', data.likes);
    });
  },
  redirectToProfile: function () {
    this.getOption('application').BasicRouter.navigate('user/' + this.current_user.id , {trigger: true});
    $.toast({
      heading: 'Success',
      text: messages['proyect'].delete,
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
        text: messages['proyect'].like-without-auth,
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