var app = app || {};

app.AuthenticationView = Backbone.Marionette.View.extend({
  el: 'main',
  template: '#container-authentication',
  regions: {
    login: '#login-region',
    register: '#register-region'
  },
  childViewEvents: {
    'switch_register': 'renderRegister',
    'switch_login': 'renderLogin'
  },
  current_sub_view: {},
  onRender: function() {
    this.current_sub_view = new app.LoginSubView();
    this.showChildView('login', this.current_sub_view);
  },
  renderRegister: function() {
    this.current_sub_view.destroy();
    this.current_sub_view = new app.RegisterSubView();
    this.showChildView('register', this.current_sub_view);
  },
  renderLogin: function() {
    this.current_sub_view.destroy();
    this.current_sub_view = new app.LoginSubView();
    this.showChildView('login', this.current_sub_view);
  }
});


app.LoginSubView = Backbone.Marionette.View.extend({
  template: '#sub-view-login',
  className: 'col-lg-6 offset-lg-3',
  regions: {
    login: '#login-region'
  },
  triggers: {
    'click a.switch': 'switch_register'
  }
});

app.RegisterSubView = Backbone.Marionette.View.extend({
  template: '#sub-view-register',
  className: 'col-lg-6 offset-lg-3',
  _username_preview: _.template('Username: <strong><%= username %></strong>'),
  _email_preview: _.template('Email: <strong><%= email %></strong>'),
  _inputs: ['#username', '#email', '#password', '#repeat'],
  regions: {
    login: '#register-region'
  },
  triggers: {
    'click a.switch': 'switch_login'
  },
  events: {
    'focusout input#username': 'checkAlReadyUse',
    'focusout input#email':    'checkAlReadyUse',
    'focusout input#password': 'checkSecurityLevel',
    'focusout input#repeat':   'checkPasswordMatches',
    'keypress input#password': 'checkSecurityLevel',
    'click button#continue':   'showFieldsetImage',
    'click button#back':       'showFieldsetInformation',
    'click button#trigger-image-input': 'triggerFileUpload',
    'click button#submit':'registerUser',
    'change input#inputFile': 'readUrl'
  },
  ui: {
    submit: '#submit',
    switch: 'a.switch'
  },
  initialize: function(){
    this.collection = new app.UserCollection();
    this.listenTo(this.collection, 'add', this.toastSuccess);
  },
  checkAlReadyUse: function (event) {
    // Check if the email or username is already use
    var input = $(event.currentTarget), data;
    var min_length = 6;
    if (input.is('#email')) {
      data = {email: input.val()}
    } else if (input.is('#username')) {
      data = {username: input.val()}
    }
    if (input.val().length >= min_length) {
      $.ajax({
        url: '/api/validation',
        type: 'GET',
        dataType: 'json',
        data: data,
        success: function(response) {
          if (response.status === 'success') {
            input.removeClass('invalid');
            input.addClass('valid');
          }
          else if (response.status === 'fail') {
            input.removeClass('valid');
            input.addClass('invalid');
          }
        }
      });
    }
    else {
      input.removeClass('valid invalid');
    }
  },
  checkSecurityLevel: function(event) {
    // Add a color border
    var input = $(event.currentTarget);
    if(input.val().length <= 6) {
      input.removeClass(
        'security-medium security-high valid'
      ).addClass('security-down');
    }
    else if(input.val().length > 6 && input.val().length <= 12) {
      input.removeClass(
        'security-down security-high'
      ).addClass('security-medium valid')
    }
    else {
      input.removeClass(
        'security-medium security-down'
      ).addClass('security-high valid')
    }
  },
  checkPasswordMatches: function(event) {
    // Check matches between password and password repeat
    var input = $(event.currentTarget),
        password = $('input#password').val();
    if (input.val() === password) {
      input.removeClass('invalid').addClass('valid');
    } else {
      input.removeClass('valid').addClass('invalid')
    }
  },
  showFieldsetImage: function () {
    if (app.validateForm(this._inputs)) {
      $('#preview-username').html(
        this._username_preview({
          username:$("input#username").val()
        })
      );
      $('#preview-email').html(
        this._email_preview({
          email:$("input#email").val()
        })
      );
      $('.fieldset-information').addClass('hidden-element');
      $('.fieldset-image').removeClass('hidden-element');
    }
    else {
      console.log('nomamaguebo')
    }

    // Validate fields, show preview info and switch the current fieldset
  },
  showFieldsetInformation: function () {
    // Validate fields, show preview info and switch the current fieldset
    $('.fieldset-information').removeClass('hidden-element');
    $('.fieldset-image').addClass('hidden-element');
  },
  readUrl: function(event){
    var input = event.currentTarget;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var imgData = e.target.result;
        var imgName = input.files[0].name;
        input.setAttribute("data-title", imgName);
        $('#preview-image').attr('src', imgData);
      };
      reader.readAsDataURL(input.files[0]);
      $('#submit').attr("disabled", false);
    }
  },
  triggerFileUpload: function () {
    document.getElementById('inputFile').click()
  },
  registerUser: function () {
    var submitButton = this.getUI('submit'),
        switchButton = this.getUI('switch'),
        image = $('input#inputFile').prop('files'), request,
        users = this.collection, reader = new FileReader();
    submitButton.attr("disabled", true); // Prevent send several ajax
    if(image.length === 1){
      reader.onloadend = function(e) {
        request = users.create({
          'name':$('input#username').val(),
          'email':$('input#email').val(),
          'password':$('input#password').val(),
          'password_confirmation':$('input#repeat').val(),
          'image_profile': reader.result
        },{
            wait:true,
            success: function () {
              switchButton.trigger('click');  // Render login form
            },
            error: function () {
              submitButton.attr("disabled", false);
              app.toastError()
          }
        });
      };
      reader.readAsDataURL(image[0]);
    } else {
      submitButton.attr("disabled", false);
      throw "File input are empty";
    }
  },
  toastSuccess: function(){
    $.toast({
      heading: 'You have successfully registered!',
      text: 'Now login to access your profile.',
      icon: 'success',
      showHideTransition: 'slide'
    })
  }
});