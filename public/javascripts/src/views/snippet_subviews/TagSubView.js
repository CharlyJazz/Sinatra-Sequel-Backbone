const Collection = require('../../collections/SnippetsTags')
const TagCollection = require('../../collections/Tags')

module.exports = Mn.View.extend({
  template: '#sub-view-tags-snippet',
  className: 'mt-2 block__tags__snippet',
  ui: {
    input: 'input#tags',
    material_input_tag: '.n-tag',
    card_tag: 'div.card-tag-searched',
    button_add: 'i.add-tag',
    button_close_card_tag: 'i#ui-close-card-tag',
    ui_list: '#ul-tags',
    button_save_tags: "button#save_tag"
  },
  events: {
    'keyup @ui.material_input_tag': 'searchTag',
    'click @ui.button_add': 'addTagToInput',
    'click @ui.button_close_card_tag': 'closeTag',
    'click @ui.button_save_tags': 'saveTagsChanges',
    'itemAdded @ui.input': 'addTag',
    'itemRemoved @ui.input': 'removeTag'
  },
  collectionEvents: {
    'sync': 'addTagsToInput'
  },
  initialize: function () {
    this.current_user = this.getOption('current_user');
    this.collection = new Collection({
      snippet_id: this.getOption('idParent')
    });
    this.tagCollection = new TagCollection();
    this.collection.fetch();
    this.tagCollection.fetch();
    this._tagsAdded = [];
    this._tagsRemoved = [];
  },
  templateContext: function() {
    var that = this;
    return {
      is_disabled: function() {
        return !that.current_user.is_authenticated() ||
                that.current_user.get('id') !== that.getOption('idUserParent')
      }
    }
  },
  onRender: function () {
    this.getUI('input').materialtags();
  },
  addTagsToInput: function () {
    var input = this.getUI('input')
    this.collection.forEach(function (tag) {
      input.materialtags('add', tag.get('name'));
    })
  },
  searchTag: function (event) {
    let value = event.target.value;
    if (value.trim()) {
      let tags = this.tagCollection.search(value), // Get collection and search tags
          ui_list = this.getUI('ui_list');
      if (tags.size() === 0) { return undefined; } // Prevent show empty
      $("#ul-tags").html(''); // Empty list
      this.getUI('card_tag').removeClass('hidden-element'); // Show the cart
      tags.each(function(tag, index) {
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
  addTagToInput: function (event) {
    /*
     * Get tag name, add and clear
     * input value of @ui.material_input_tag
     * */
    this.getUI('input').materialtags('add', event.target.parentElement.innerText);
    $('.n-tag').val('');
  },
  closeTag: function () {
    this.getUI('card_tag').addClass('hidden-element');
  },
  ShowButtonSaveTags: function() {
    var button = this.getUI('button_save_tags');
    if (!button.is(":visible")) {
      button.removeClass('hidden-element');
    }
  },
  addTag: function (event) {
    /*
    * Add news tags to array _tagsAdd
    * Prevent add repeat tags
    * Remove tag in _tagsRemoved if exist
    * */
    var tag_name = event.item,
        index = this._tagsRemoved.indexOf(tag_name);;

    // Check if the tag already exist in the collection of saved tags
    if (!this.collection.findWhere({name: tag_name})) {
      this._tagsAdded.push(tag_name);
      // Check if the tag already exist in removed tags array
      if (index > -1) {
        this._tagsRemoved.splice(index, 1);
      }
      this.ShowButtonSaveTags();
    } else {
      // If exist in the collection and can writed in the input then
      // the tag already exist in removed tags array
      this._tagsRemoved.splice(index, 1);
    }
  },
  removeTag: function (event) {
    /*
     * Add tags removed to array _tagsRemoved
     * Remove tags in _tagsAdded if exist
     * */
    if (event.item == undefined) { return; }

    var tag_name = event.item,
        index = this._tagsAdded.indexOf(tag_name);

    this.ShowButtonSaveTags();

    if (this.collection.findWhere({name: tag_name})) {
      this._tagsRemoved.push(tag_name);
    } else if (index > -1) {
        this._tagsAdded.splice(index, 1);
    }
  },
  saveTagsChanges: function () {
    /*
    * Create ajax's for save new tags and remove tags
    * Prevent send ajax data empty
    * */

    var deferreds = [],
        that = this,
        cardTag = button = this.getUI('card_tag');

    cardTag.addClass('hidden-element');

    if (this._tagsRemoved.length) {
      deferreds.push(this.collection.removeTags(this._tagsRemoved));
    }
    if (this._tagsAdded.length) {
      deferreds.push(this.collection.addTags(this._tagsAdded));
    }

    if (deferreds.length) {
      $('button#save_tag')
        .prop('disabled', true)
        .find('i')
        .removeClass('fa-check')
        .addClass('fa-spin fa-refresh');

      $.when.apply($, deferreds).then(function() {
        that.collection.fetch();
        that._tagsAdded = [];
        that._tagsRemoved = [];

        $('button#save_tag')
          .addClass('hidden-element')
          .prop('disabled', false)
          .find('i')
          .removeClass('fa-spin fa-refresh')
          .addClass('fa-check');

      });
    }
  }
});