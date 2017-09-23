module.exports = function(arrIds) {
  let isValid = true;

  arrIds.forEach(function (inputId) {
    if (!$('input' + inputId).hasClass('valid')) {
      isValid = false;
    }
  });

  return isValid;
};