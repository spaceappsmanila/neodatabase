var Schema = require('../schema'); //Schema Declaration
var eSend = require('emailjs/email'); //Email Sender

//Domain Name:
var domainName = 'localhost';
var port = '1337'; //Can be Null, defaults to ''

//TODO: DELETE THIS LATER!
var e_host = '';//Email Host
var e_user = '';//Email UserName
var e_name = ''; //Email Name
var e_pass = '';//Email Password

//Server Object, will send the email.
var server  = eSend.server.connect({
   user:      e_user, 
   password:  e_pass, 
   host:      e_host, 
   ssl:       true
});

var messageBody = function(token) {
  var returnMessage = 'Thank you for registering.<br/>'+
  'please click this <a href="http://'+domainName+((port !== '' || port !== null) ? ':'+port : '' )+'/activate/'+token+'">link</a> to activate your account.<br/>'+
  'You must activate your registration first before you can log-in with your email address.';
  
  return returnMessage;
};

/*
 * GET REGISTRATION page.
 */

exports.getForm = function(req, res){
  res.render('register');
};

/*
 * GET REGISTRATION page.
 */

exports.postForm = function(req, res){
  var returnObject = null;
  console.log(req.body);
  console.log(Schema);
  var newUser 
    = new Schema.User({
        email: req.body.email, 
        name: req.body.name, 
        password: req.body.password
    });
  newUser.save(function (err) {
    if(err) {
      res.render('register-error');
    }
    else {
        var token = Schema.generateToken();
        //TODO: Better Validation Code Implementation(Upsert would be probable)
        var validationCode = new Schema.ValidationCode({
          _id: newUser._id,
          email: newUser.email,
          code: token
        });
        validationCode.save(function(err) {
          var emailContents = messageBody(validationCode.code);
          // send the message and get a callback with an error or details of the message that was sent
          server.send({
            text:    emailContents, 
            from:    e_name+' <'+e_user+'>', 
            to:      validationCode.email,
            subject: 'DB NEO - Registration',
            attachment: [{data: emailContents, alternative:true}]
          }, function(err, message) { console.log(err || message); });
          res.render('register-ok');
        });
    }
  });
};

/*
 * User Activation Page
 */
exports.activateUser = function(req,res) {
  console.log(req.params.token);
  //TODO: Look up!
  res.send(200);
};
