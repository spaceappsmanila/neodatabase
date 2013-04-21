//Reference of Mongoose and Schema Object
var mongoose = require('mongoose')
  ,Schema = mongoose.Schema;
var crypto = require('crypto');
var databaseURL = 'localhost'; //Host
var databaseName = 'DBNeo'; //Database Name
var byteCount = 64; //For Token Generation - Validation
var secret = 'Welcome to The Dungeon!!~'; //Secret String for Password Salting.
var enc = 'sha1'; //Encryption Algorithm

mongoose.connect(databaseURL,databaseName);

//Encryption: For Password
var encodePassword = function(inputText) {
  
  var hmac = crypto.createHmac(enc, secret);
  hmac.update(inputText);

  return hmac.digest('hex');
};

var generateToken = function() {
  var buf = crypto.randomBytes(byteCount);
  return buf.toString('hex');
};


//User Schema
var UserSchema = Schema({
  name: {type: String, required: true}
  ,email: {type: String, required: true, unique: true}
  ,password: { type: String, set: encodePassword, required: true }
  ,active: { type: Boolean, default: false }
});

UserSchema.virtual('id').get(function () {
  return this._id;
});

//Validation Code Schema
var ValidationCodeSchema = Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true, default: generateToken }
});

ValidationCodeSchema.virtual('id').get(function () {
  return this._id;
});


//Models
var UserModel = MyModel = mongoose.model('User', UserSchema);
var ValidationCodeModel = mongoose.model('ValidationCode',ValidationCodeSchema);

exports.User = function(parameters) {
  return new UserModel(parameters);
}
exports.ValidationCode = function(parameters) {
  return new ValidationCodeModel(parameters);
}

exports.encodePassword = encodePassword;
exports.generateToken = function() {
  var token = generateToken();
  return token;
};
