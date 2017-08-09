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

app.toastError = function () {
  $.toast({
    heading: 'There was an error, try later',
    text: 'Are your sure have internet?',
    icon: 'warning',
    showHideTransition: 'slide'
  });
};