var app = app || {};

app.CreateSnippetView = Mn.View.extend({
  el: 'main',
  template: '#container-create-snippet',
  events:{
  },
  ui: {
    editor: '#editor',
    submit: '#submit'
  },
  onRender: function() {
    CodeMirror.fromTextArea(document.getElementById("editor"), {
      lineNumbers: true,
      mode: 'htmlmixed',
      theme: 'railscasts',
      showCursorWhenSelecting:true,
      styleActiveLine: true,
      lineWrapping: true
    });
  }
});