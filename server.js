
/**
 * module dependincies
 */

 var express = require('express')
 , http = require('http')
 , path = require('path');



/**
 * configuration
 */

 var app = express();

 app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: __dirname + "/public/uploads"}));
  app.use(express.cookieParser());
  app.use(express.session({secret: 'hahaokyesno555'}));
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

 app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./server/router')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/**
 * Only listen on $ sudo node server.js
 */


