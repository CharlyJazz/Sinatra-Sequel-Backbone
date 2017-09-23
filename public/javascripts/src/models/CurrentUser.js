module.exports = Backbone.Model.extend({
  /*
  * Current user using the appication
  * When the User login then create this Model
  * */
  defaults: {
    permission_level: 0,
    image_profile: (function(){
      return window.localStorage.getItem('image_profile')
    })
  },
  is_authenticated: function() {
    /*
    * Check if CurrentUser is authenticated
    * */
    if (this.get('permission_level') > 0) {
      return true;
    }
    return false;
  },
  add_token: function (token) {
    /*
    * Add authentication token
    * */
    window.localStorage.setItem('token', token);
  },
  get_token: function() {
    /*
    * Check if user is authenticated and return the
    * token else false
    * */
    if (this.is_authenticated()) {
      return window.localStorage.getItem('token');
    }
    return false;
  },
  remove_token: function () {
    /*
    * Check if user is authenticated then remove token
    * and return true else return false
    * */
    if (this.get_token()) {
      window.localStorage.removeItem('token');
      return true;
    }
    return false;
  },
  set_image_profile: function(image_string_base_64) {
    /*
    * Check if user is authenticated then set image in Storage
    * and return true else return false
    * */
    if (this.is_authenticated()) {
      return window.localStorage.setItem('image_profile', image_string_base_64);
    }
    return false;
  },
  logout: function(){
    /*
     * Return ajax for create Promise
     * */
    return $.ajax({type: 'POST', url: '/auth/logout'});
  }
});