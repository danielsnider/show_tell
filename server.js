
/**
 * module dependincies
 */

var express = require('express')
  , routes = require('./routes')
  , upload = require('./routes/upload')
  , http = require('http')
  , path = require('path');

/**
 * configuration
 */

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: __dirname + "/public/uploads"}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.post('/file_upload', function(req, res, next) {
    console.log(req.body);
    console.log(req.files);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/**
 * Only listen on $ sudo node server.js
 */

var connect = require('connect');

connect.createServer(
    connect.static(__dirname)
).listen(8080);

