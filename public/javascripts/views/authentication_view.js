var app = app || {};

app.AuthenticationView = Mn.View.extend({
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

app.LoginSubView = Mn.View.extend({
  template: '#sub-view-login',
  className: 'col-lg-6 offset-lg-3',
  regions: {
    login: '#login-region'
  },
  triggers: {
    'click a.switch': 'switch_register'
  },
  events: {
    'click @ui.submit': 'loginUser'
  },
  ui: {
    'submit': '#submit',
    'password_input': 'input#password',
    'email_input': 'input#email'
  },
  loginUser: function () {
    var password = this.getUI('password_input'),
        email = this.getUI('email_input');
    if (password.val().length < 7) {
      $.toast({
        heading: 'Password very tiny!',
        text: 'The password no is correct',
        icon: 'warning',
        showHideTransition: 'slide'
      });
    }
    else {
      // Send ajax for login the user
      $.ajax({
        type: 'POST',
        url: '/auth/login',
        data: {
          'email': email.val(),
          'password': password.val()
        },
        dataType: 'json',
        success: function (response) {
          // Show toast
          $.toast({
            heading: 'Welcome ' + response.username,
            text: 'Wait while loading your profile',
            icon: 'success',
            showHideTransition: 'slide',
            hideAfter: 1600
          });
          // Update current_user attributes
          app.current_user.set({
              username: response.username,
              email: response.email,
              id: response.id,
              permission_level: response.permission_level
          });
          // Update current_user profile image
          app.current_user.set_image_profile(response.image_profile);
          // Update current_user token
          app.current_user.add_token(response.token);
          // Active User Auth Routes and redirect to the profile
          app.userAuthRouter = new app.UserAuthRouter();
        },
        error: function (response) {
          $.toast({
            heading: 'The data does not match',
            text: 'Make sure your password and mail with the correct ones',
            icon: 'error',
            showHideTransition: 'slide'
          });
        }
      });
    }
  }
});

app.RegisterSubView = Mn.View.extend({
  template: '#sub-view-register',
  className: 'col-lg-6 offset-lg-3',
  _username_preview: _.template('Username: <strong><%= username %></strong>'),
  _email_preview: _.template('Email: <strong><%= email %></strong>'),
  _inputs: ['#username', '#email', '#password', '#repeat'],
  _image_dimension: {'height':300, 'width':300},
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
    switch: 'a.switch',
    image_preview: '#preview-image',
    fieldset_information: '.fieldset-information',
    fieldset_image: '.fieldset-image'
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
    /*
     * Add username and email preview data and
     * Show fieldset image or show toast if not have image profile
     * */
    if (app.validateForm(this._inputs)) {
      $('#preview-username').html(
        this._username_preview({
          username:$('input#username').val()
        })
      );
      $('#preview-email').html(
        this._email_preview({
          email:$('input#email').val()
        })
      );
      this.getUI('fieldset_information').addClass('hidden-element');
      this.getUI('fieldset_image').removeClass('hidden-element');
    }
    else {
      $.toast({
        heading: 'Fill all fields!',
        text: 'Remember, the password need more that 6 characters',
        icon: 'info',
        showHideTransition: 'slide'
      })
    }
  },
  showFieldsetInformation: function () {
    /*
    * Show fieldset information
    * */
    this.getUI('fieldset_information').removeClass('hidden-element');
    this.getUI('fieldset_image').addClass('hidden-element');
  },
  readUrl: function(event){
    // Validate size of image and show image preview
    var input = event.currentTarget,
        _URL = window.URL || window.webkitURL,
        max_width = this._image_dimension.width,
        max_height = this._image_dimension.height,
        submit = this.getUI('submit'),
        image_preview = this.getUI('image_preview');
    if (input.files && input.files[0]) {
      var img = new Image();
      img.onload = function(e) {
        var width = img.naturalWidth, height = img.naturalHeight;
        if (width <= max_width && height <= max_height ) {
          input.setAttribute('data-title', input.files[0].name);
          image_preview.attr('src', e.target.src); // transform to UI element
          submit.attr('disabled', false);// transform to UI element
        }
        else {
          $.toast({
            heading: 'Image dimensions not supported',
            text: 'Your image should be ' + max_height + ' px wide and '
                  + max_height + ' px and ' + max_height + ' long or smaller',
            icon: 'error',
            showHideTransition: 'slide'
          });
        }
      };
      img.src = _URL.createObjectURL(input.files[0]);
    }
  },
  triggerFileUpload: function () {
    document.getElementById('inputFile').click()
  },
  registerUser: function () {
    var submitButton = this.getUI('submit'),
        switchButton = this.getUI('switch'),
        image = $('input#inputFile').prop('files'),
        reader = new FileReader(), user = new app.User(),
        that = this;
    submitButton.attr('disabled', true); // Prevent send several ajax
    if(image.length === 1){
      reader.onloadend = function() {
        user.save({
          'name':$('input#username').val(),
          'email':$('input#email').val(),
          'password':$('input#password').val(),
          'password_confirmation':$('input#repeat').val(),
          'image_profile': reader.result
          },{
          wait:true,
          success: function () {
            switchButton.trigger('click'); // Render login form
            that.toastSuccess();
          },
          error: function () {
            submitButton.attr('disabled', false);
            app.toastError();
          }
        });
      };
      reader.readAsDataURL(image[0]);
    } else {
      submitButton.attr('disabled', false);
      throw 'File input are empty';
    }
  },
  toastSuccess: function(){
    $.toast({
      heading: 'You have successfully registered!',
      text: 'Now login to access your profile.',
      icon: 'success',
      showHideTransition: 'slide'
    });
  }
});