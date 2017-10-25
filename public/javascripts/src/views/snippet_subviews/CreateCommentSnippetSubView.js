const messages = require('../../../../../tmp/messages.json')

module.exports = Mn.View.extend({
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
      image_profile: this.current_user.get('image_profile'),
      permission_level: this.current_user.get('permission_level')
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
    this.current_user = this.getOption('current_user');
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
      dict.user_id = this.current_user.get('id');
      dict.user_name = this.current_user.get('name');
      dict.user_picture = this.current_user.get('image_profile');
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