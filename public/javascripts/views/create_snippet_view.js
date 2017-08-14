var app = app || {};

app.CreateSnippetView = Mn.View.extend({
  // TODO: convertir tag input y su lista de tag en una Region apra poder hacer fetch sync
  template: '#container-create-snippet',
  events:{
    'click @ui.submit': 'createSnippet',
    'keydown @ui.material_input_tag': 'searchTag',
    'click @ui.button_add': 'addTag',
    'click @ui.button_close_card_Tag': 'closeTag'
  },
  ui: {
    editor: '#editor',
    submit: '#submit',
    input_filename: 'input#filename',
    input_tag: 'input#tags',
    material_input_tag: '.n-tag',
    button_add: 'i.add-tag',
    card_tag: 'div.card-tag-searched',
    button_close_card_Tag: 'i#ui-close-card-tag'
  },
  initialize: function() {
    this.tags = new app.TagCollection();
    this.tags.fetch();
  },
  onRender: function() {
    this.getUI('input_tag').materialtags();
    that = this;
    setTimeout(function() {
      that.editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'railscasts',
        showCursorWhenSelecting:true,
        styleActiveLine: true,
        lineWrapping: true
      });
    },1);
  },
  createSnippet: function (event) {
    /*
    * Validate filename format and file body
    * and create Snipppet
    * */
    var pattern = /^[\w,\s-]+\.[A-Za-z]{1,5}$/,
        filename = this.getUI('input_filename').val(),
        body = this.editor.getValue(), that = this;
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
        var snippet = new app.Snippet({
          'filename':filename,
          'body':body,
          'user_id': app.current_user.get('id')
        });
        snippet.save({wait: true},{
          success: function(response) {
            that._relationSnippetWithTags(response.id);
            $.toast({
              heading: 'Success!',
              text: 'Your snippet was created with success',
              icon: 'success',
              showHideTransition: 'slide'
            });
            // TODO: Redirect al snippet con su id en la url
            app.applicationBasicRouter.navigate('snippets', {trigger: true});
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
  _relationSnippetWithTags: function (id) {
    /*
     * Get tags and call save
     * */
    var tags = this.getUI('input_tag').materialtags('items').toString(),
        new_tag = new app.SnippetTag({"name":tags, snippet_id:id});
    new_tag.save({wait: true});
  },
  searchTag: function (event) {
    var value = event.target.value;
    if (!value.trim() == ""){
      var tags = this.tags.search(value); // Search tags
      if (tags.size() === 0) { return undefined; } // Prevent show empty
        $("#ul-tags").html(''); // Empty list
        this.getUI('card_tag').removeClass('hidden-element'); // Show the cart
        tags.each(function(tag, index){
          if (index >= 10) { return undefined } // Prevent shown more that 10 tags
          var view = new Mn.View({ // Show each tag in the list
            model: tag,
            template: _.template("<li><i class='fa fa-plus add-tag'></i>{{=name}}</li>")
          });
          $("#ul-tags").append(view.render().el);
        });
    }
    else {
      this.getUI('card_tag').addClass('hidden-element');
    }
  },
  addTag: function (event) {
    /*
    * Get tag name, add and clear
    * input value of @ui.material_input_tag
    * */
    this.getUI('input_tag').materialtags('add',
      event.target.parentElement.innerText
    );
    $('.n-tag').val('');
  },
  closeTag: function () {
    this.getUI('card_tag').addClass('hidden-element');
  }
});