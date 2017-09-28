const TagSearchSubView = require('./create_snippet_subview/TagSearchSubView')
const TagCollection = require('../collections/Tags')
const Snippet = require('../models/Snippet')
const SnippetTag = require('../models/SnippetTag')

module.exports = Mn.View.extend({
  template: '#container-create-snippet',
  regions: {
    tags: '#region-tags'
  },
  events:{
    'click @ui.submit': 'createSnippet',
    'keyup @ui.material_input_tag': 'searchTag',
    'click @ui.button_add': 'addTag',
    'click @ui.button_close_card_tag': 'closeTag'
  },
  ui: {
    editor: '#editor',
    submit: '#submit',
    input_filename: 'input#filename',
    input_tag: 'input#tags',
    material_input_tag: '.n-tag',
    card_tag: 'div.card-tag-searched',
    button_add: 'i.add-tag',
    button_close_card_tag: 'i#ui-close-card-tag'
  },
  initialize: function() {
    this.application = this.getOption('application')
  },
  onRender: function() {
    let that = this;
    this.getUI('input_tag').materialtags();
    setTimeout(function() {
      that.editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: 'htmlmixed',
        showCursorWhenSelecting:true,
        styleActiveLine: true,
        lineWrapping: true
      });
    },1);
    this.showChildView('tags', new TagSearchSubView({
      collection: new TagCollection()
    }));
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
        let snippet = new Snippet({
          'filename':filename,
          'body':body,
          'user_id': this.application.current_user.get('id')
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
            that.application.BasicRouter.navigate('snippets/' + response.id , {trigger: true});
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
    let tags = this.getUI('input_tag').materialtags('items').toString();

    if (tags.length) {
      let new_tag = new SnippetTag({"name":tags, snippet_id:id});
      new_tag.save({wait: true});
    }
  },
  searchTag: function (event) {
    let value = event.target.value;
    if (value.trim()) {
      let tags = this.getChildView('tags').collection.search(value), // Get collection and search tags
          ui_list = this.getChildView('tags').getUI('list');
      if (tags.size() === 0) { return undefined; } // Prevent show empty
        $("#ul-tags").html(''); // Empty list
        this.getUI('card_tag').removeClass('hidden-element'); // Show the cart
        tags.each(function(tag, index){
        if (index >= 10) { return undefined } // Prevent shown more that 10 tags
        let view = new Mn.View({ // Show each tag in the list
          model: tag,
          template: _.template("<li><i class='fa fa-plus add-tag'></i>{{=name}}</li>")
        });
        ui_list.append(view.render().el);
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
    this.getUI('input_tag').materialtags('add', event.target.parentElement.innerText);
    $('.n-tag').val('');
  },
  closeTag: function () {
    this.getUI('card_tag').addClass('hidden-element');
  }
});