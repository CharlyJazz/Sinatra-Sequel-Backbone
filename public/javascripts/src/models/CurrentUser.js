const User = require('./User')

module.exports = User.extend({
  /*
  * Current user using the appication
  * When the User login then create this Model
  * */
  defaults: {
    permission_level: 0
  },
  is_authenticated: function() {
    /*
    * Check if current user is authenticated
    * */
    return this.get('permission_level');
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
  logout: function() {
    /*
     * Return ajax for create Promise
     * */
    return $.ajax({type: 'POST', url: '/auth/logout'});
  }
});