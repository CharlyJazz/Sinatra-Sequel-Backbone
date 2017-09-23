module.exports = function() {
  const config = $('#config');

  return JSON.parse(config.text());
};