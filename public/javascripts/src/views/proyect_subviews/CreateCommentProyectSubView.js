const messages = require('../../../../../tmp/messages.json')
const template = require('../../../../../views/application_sub_views/comment_form.erb');

module.exports = Mn.View.extend({
  template: template,
  className: 'row',
  ui: {
    submit: '#submit',
    form: 'form',
    buttonHideTitleInput: '#ui-button-hide-title',
    buttonHideLineNumberInput: '#ui-button-hide-line-number',
    textarea: '#textarea-comment'
  },
  events: {
    'click @ui.submit': 'createComment'
  },
  templateContext: function() {
    /*
     The templateContext object can also be a function
     returning an object. This is useful when you want
     to access information from the surrounding view (e.g. model methods).
     */
    return {
      image_profile: this.current_user.get('image_profile'),
      permission_level: this.current_user.get('permission_level'),
      comment_type: 'proyect'
    }
  },
  initialize: function () {
    this.current_user = this.getOption('current_user');
    this.collection = this.getOption('collection_comment');
  },
  createComment: function () {
    /*
     * Validate comment, save and add to Collection View
     * */
    var text_area_value = this.getUI('textarea').val(),
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
      dict.user_id = this.current_user.get('id');
      dict.user_name = this.current_user.get('name');
      dict.user_picture = this.current_user.get('image_profile');
      /**
       * Prevent Bug with wait true
       * https://stackoverflow.com/questions/11659012/how-to-get-the-id-when-i-create-a-save-a-new-model
       */
      this.collection.create(dict, {
        wait: true
      });
      this.toastCreateComment();
      this.trigger('commentCreated');
    }
  },
  toastInvalidComment: function () {
    $.toast({
      heading: 'Error',
      text: messages['user'].comment.validation.textarea,
      icon: 'error',
      showHideTransition: 'slide'
    });
  },
  toastCreateComment: function () {
    $.toast({
      heading: 'Success!',
      text: messages['user'].comment.create,
      icon: 'success',
      showHideTransition: 'slide'
    });
  }
});