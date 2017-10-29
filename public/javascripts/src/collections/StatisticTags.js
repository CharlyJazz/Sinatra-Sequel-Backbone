module.exports = function(path) {
  /*
  * Path supported: languages, technologys, frameworks
  * */
  if (['languages', 'technologys', 'frameworks'].indexOf(path) === -1) {
    throw 'Path supported: languages, technologys, frameworks';
  }

  return Backbone.Collection.extend({
    model: Backbone.Model,
    initialize: function (models, options) {
      this.user_id = options.user_id;
    },
    url: function () {
      return '/api/user/' + this.user_id + '/statistics/' + path;
    }
  });
}