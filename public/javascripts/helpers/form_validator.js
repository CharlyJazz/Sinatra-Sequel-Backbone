var app = app || {};

app.validateForm = function(arrIds) {
  var isValid = true;

  arrIds.forEach(function (inputId) {
    if (!$('input' + inputId).hasClass('valid')) {
      isValid = false;
    }
  });

  return isValid;
};