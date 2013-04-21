$(function() {
  $('#registerForm').validate({
    rules: {
      emailAddress: {
        required: true
      }
    }
  });
});

function checkPassword() {
    console.log('I was called');
    var pw1 = document.getElementById('password').value;
    var pw2 = document.getElementById('password2').value;
    if (pw1 != pw2) { 
      return false;
      console.log('In Here');
      document.getElementById('password').setCustomValidity('The two passwords must match.');
      
    } 
}
