
/**
 * Module dependencies.
 */

var express = require('express')
  , register = require('./routes/register')
  , login = require('./routes/login')
  , observation = require('./routes/observation')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('NeonDatabaseSecretParserKey'));
  app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/register',register.getForm);
app.post('/register',register.postForm);
app.get('/activate/:token',register.activateUser);
app.get('/login',login.login);
app.post('/login',login.loginVerify)
app.get('/submitObs',observation.report)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
