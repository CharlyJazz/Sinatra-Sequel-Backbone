const messages = require('../../../../tmp/messages.json');

module.exports = function () {
  $.toast({
    heading: messages['server-error'].heading,
    text: messages['server-error'].text,
    icon: 'warning',
    showHideTransition: 'slide'
  });
};