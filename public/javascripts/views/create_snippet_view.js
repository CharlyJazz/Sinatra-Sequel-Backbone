var app = app || {};

app.CreateSnippetView = Mn.View.extend({
  el: 'main',
  template: '#container-create-snippet',
  events:{
    'click @ui.submit': 'createSnippet',
    'keypress @ui.material_input_tag': 'searchTags'
  },
  ui: {
    editor: '#editor',
    submit: '#submit',
    input_filename: 'input#filename',
    input_tag: 'input#tags',
    material_input_tag: '.n-tag'
  },
  onRender: function() {
    this.editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
      lineNumbers: true,
      mode: 'htmlmixed',
      theme: 'railscasts',
      showCursorWhenSelecting:true,
      styleActiveLine: true,
      lineWrapping: true
    });
    this.getUI('input_tag').materialtags();
  },
  createSnippet: function (event) {
    /*
    * Validate filename format and file body
    * and create Snipppet
    * */
    var pattern = /^[\w,\s-]+\.[A-Za-z]{1,5}$/,
        filename = this.getUI('input_filename').val(),
        body = this.editor.getValue();
    if (pattern.test(filename)) {
      if (body.length <= 4){
        $.toast({
          heading: 'Write more, lazy',
          text: 'You need more than 4 characters to create the snippet',
          icon: 'warning',
          showHideTransition: 'slide'
        });
      }
      else {
        this.getUI('submit').prop('disabled', true);
        var snippet = new app.UserSnippets({
          'filename':filename,
          'body':body,
          'user_id': app.current_user.get('id')
        });
        snippet.save({wait: true},{
          success: function() {
            $.toast({
              heading: 'Success!',
              text: 'Your snippet was created with success',
              icon: 'success',
              showHideTransition: 'slide'
            });
            // TODO: Redireccionar a la vista indivual del snippet
          }
        });
      }
    }
    else {
      $.toast({
        heading: 'Filename is invalid',
        text: 'Remember to add the file extension: Filename.py',
        icon: 'warning',
        showHideTransition: 'slide'
      });
    }
  },
  relationSnippetWithTags: function () {
    /*
    * Get tags
    * Create tag model with the correct urlRoot
    * And call create()
    * */
  },
  searchTags: function (event) {
    console.log(event.target.value)
  }
});