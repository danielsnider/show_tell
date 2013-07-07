
/**
 * module dependincies
 */

 var express = require('express')
 , routes = require('./routes')
 , upload = require('./routes/upload')
 , http = require('http')
 , path = require('path');

 var exec = require('child_process').exec, child;
 var fs = require("fs");
 var path = require("path");

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

//route http get request to index.ejs page 
app.get('/', routes.index);

app.get('/edit', function(req, res){
  res.render('edit', { title: 'Show and Tell' });
 });

//executes everytime some speech is recognized
app.get('/checkForKeywordMatch.js?*', function(req, res){
  var file_list = new Array();
  var stored_keyword_list = new Array();
  var queried_keyword_list = new Array();
  var command = "ls ./public/uploads/";

  //set queried keyword list
  queried_keyword_list = req.query.body.split('-');
  console.log("queried_keyword_list: "+queried_keyword_list);

  child = exec(command, function (error, stdout, stderr) {
      // console.log("command: "+command);
      // console.log('stdout: ' + stdout);

      file_list = stdout.split("\n"); //create file list
      // console.log("file_list: "+file_list);
      
      //set stored keyword list
      for (var i=0; i < file_list.length; i++)
      {
        temparr = file_list[i].replace(/\.[^/.]+$/, ""); //remove file extension
        temparr = temparr.split(" "); //split keywords
        for (var x=0; x < temparr.length; x++)
        {
          var new_keyword = temparr[x].split("-");
          if (new_keyword != '' || null){ stored_keyword_list.push(new_keyword); }
        }
      }

      //try to find keyword in keyword list
      for (var i=0; i < stored_keyword_list.length; i++)
      {
        for (var x=0; x < queried_keyword_list.length; x++)
        {
          console.log("checking for match stored: "+ stored_keyword_list[i] + " <--queried> " + queried_keyword_list[x]);
          
          if (stored_keyword_list[i] == queried_keyword_list[x])
          {
            for (var y=0; y < file_list.length; y++)
            {
              if (file_list[y].indexOf(queried_keyword_list[x]) >= 0)
              {
                console.log("match found: "+ file_list[y]);
                res.writeHeader(200, {"Content-Type": "text/plain"});  
                res.write('<img src="uploads/' + file_list[y] + '" alt="new visuals go here"  id="visuals">');
                res.end(); 
              }
            }
          }
        }
      }
    });

 });


//process uploaded files
app.post('/', function(req, res) {
  res.render('index', { title: 'Show and Tell' });

    // console.log(req.body);
    // console.log(req.files);
    var keyword = req.body.keyword.replace(/ /g,'-');
    var file = req.files.file.path;

    command = "mv " + file + " ./public/uploads/" + keyword;
    child = exec(command, function (error, stdout, stderr) {
      console.log(command);
      console.log('stdout: ' + stdout);
    });
  });

//go to this page to pull the latest git code and restart the webserver
app.post('/restart', function(req, res) {

    command = "./restart.sh";
    child = exec(command, function (error, stdout, stderr) {
      // console.log(command);
      // console.log('stdout: ' + stdout);
    });
  });

http.createServer(app).listen(app.get('port'), function(){
  // connect.static(__dirname)
	//test!!
  console.log("Express server listening on port " + app.get('port'));
});


/**
 * Only listen on $ sudo node server.js
 */

 var connect = require('connect');



