
 var exec = require('child_process').exec, child;
 var path = require("path");
 var moment = require('moment');

var DB = require('./database');
var CT = require('./country-list');
var EM = require('./email-dispatcher');

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');


module.exports = function(app) {


//route http get request to index.ejs page
app.get('/', function(req, res){
  res.render('index.ejs', { title: 'Show and Tell', keywords: req.session.keywords});
});

//executes everytime some speech is recognized
app.get('/checkForKeywordMatch.js?*', function(req, res){
  var file_list = new Array();
  var stored_keyword_list = new Array();
  var queried_keyword_list = new Array()
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

    var keyword = req.body.keyword.replace(/ /g,'-');
    var file = req.files.file.path;

    command = "mv " + file + " ./public/uploads/" + keyword;
    child = exec(command, function (error, stdout, stderr) {
      console.log(command);
      console.log('stdout: ' + stdout);
    });
  });

//go to this page to pull the latest git code and restart the webserver
app.get('/restart', function(req, res) {

  command = "pwd; ls; ./update_code.sh";
  child = exec(command, function (error, stdout, stderr) {
   console.log(command);
   console.log('stdout: ' + stdout);
   console.log('stderr: ' + stderr);
   console.log('error: ' + error);
   });
  });

/*                            */
/*                            */
/*                            */
/*                            */
/* account management methods */
/*                            */
/*                            */
/*                            */
/*                            */

app.get('/login', function(req, res){
// check if the user's credentials are saved in a cookie //
  if (req.cookies.user == undefined || req.cookies.pass == undefined){
    res.render('login.jade', { title: 'Hello - Please Login To Your Account' });
  } else{
// attempt automatic login //
    DB.autoLogin(req.cookies.user, req.cookies.pass, function(o){
      if (o != null){
          req.session.user = o;
        res.redirect('/edit');
      } else{
        res.render('login.jade', { title: 'Hello - Please Login To Your Account' });
      }
    });
  }
});

app.post('/login', function(req, res){
    DB.manualLogin(req.param('user'), req.param('pass'), function(e, o){
      if (!o){
        res.send(e, 400);
      } else{
          req.session.user = o;
          if (req.param('remember-me') == 'true'){
            res.cookie('user', o.user, { maxAge: 900000 });
            res.cookie('pass', o.pass, { maxAge: 900000 });
          }
        res.send(o, 200);
      }
    });
  });

// logged-in user homepage //

  app.get('/home', function(req, res) {
      if (req.session.user == null){
  // if user is not logged-in redirect back to login page //
          res.redirect('/login');
      }   else{
      res.render('home.jade', {
        title : 'Control Panel',
        countries : CT,
        udata : req.session.user
      });
      }
  });

  app.post('/home', function(req, res){
    if (req.param('user') != undefined) {
      DB.updateAccount({
        user    : req.param('user'),
        name    : req.param('name'),
        email     : req.param('email'),
        country   : req.param('country'),
        pass    : req.param('pass')
      }, function(e, o){
        if (e){
          res.send('error-updating-account', 400);
        } else{
          req.session.user = o;
      // update the user's login cookies if they exists //
          if (req.cookies.user != undefined && req.cookies.pass != undefined){
            res.cookie('user', o.user, { maxAge: 900000 });
            res.cookie('pass', o.pass, { maxAge: 900000 });
          }
          res.send('ok', 200);
        }
      });
    } else if (req.param('logout') == 'true'){
      res.clearCookie('user');
      res.clearCookie('pass');
      req.session.destroy(function(e){ res.send('ok', 200); });
    }
  });

// creating new accounts //

  app.get('/signup', function(req, res) {
    res.render('signup.jade', {  title: 'Signup', countries : CT });
  });

  app.post('/signup', function(req, res){
    DB.addNewAccount({
      name  : req.param('name')
,      email   : req.param('email'),
      user  : req.param('user'),
      pass  : req.param('pass'),
      country : req.param('country')
    }, function(e){
      if (e){
        res.send(e, 400);
      } else{
        res.send('ok', 200);
      }
    });
  });

// password reset //

  app.post('/lost-password', function(req, res){
  // look up the user's account via their email //
    DB.getAccountByEmail(req.param('email'), function(o){
      if (o){
        res.send('ok', 200);
        EM.dispatchResetPasswordLink(o, function(e, m){
        // this callback takes a moment to return //
        // should add an ajax loader to give user feedback //
          if (!e) {
          //  res.send('ok', 200);
          } else{
            res.send('email-server-error', 400);
            for (k in e) console.log('error : ', k, e[k]);
          }
        });
      } else{
        res.send('email-not-found', 400);
      }
    });
  });

  app.get('/reset-password', function(req, res) {
    var email = req.query["e"];
    var passH = req.query["p"];
    DB.validateResetLink(email, passH, function(e){
      if (e != 'ok'){
        res.redirect('/');
      } else{
  // save the user's email in a session instead of sending to the client //
        req.session.reset = { email:email, passHash:passH };
        res.render('reset.jade', { title : 'Reset Password' });
      }
    })
  });

  app.post('/reset-password', function(req, res) {
    var nPass = req.param('pass');
  // retrieve the user's email from the session to lookup their account and reset password //
    var email = req.session.reset.email;
  // destory the session immediately after retrieving the stored email //
    req.session.destroy();
    DB.updatePassword(email, nPass, function(e, o){
      if (o){
        res.send('ok', 200);
      } else{
        res.send('unable to update password', 400);
      }
    })
  });

// view & delete accounts //

  app.get('/print', function(req, res) {
    DB.getAllRecords( function(e, accounts){
      res.render('print.jade', { title : 'Account List', accts : accounts });
    })
  });

  app.post('/delete', function(req, res){
    DB.deleteAccount(req.body.id, function(e, obj){
      if (!e){
        res.clearCookie('user');
        res.clearCookie('pass');
              req.session.destroy(function(e){ res.send('ok', 200); });
      } else{
        res.send('record not found', 400);
      }
      });
  });

  app.get('/reset', function(req, res) {
    DB.delAllRecords(function(){
      res.redirect('/print');
    });
  });



/*                            */
/*                            */
/*                            */
/*                            */
/*      edit deck methods     */
/*                            */
/*                            */
/*                            */
/*                            */

app.get('/present', function(req, res){
  // DB.fixSlideOrder(req.session.deckid); // BUG
  if (req.query.deckid) {
    DB.getSlidesByDeckId(req.query.deckid, function(e, slides){
      slides = slides.sort(compare);
      // console.log("slides:"+slides)
      res.render('present.jade', {
        'slides': slides,
        'deck_id': req.query.deckid
      });
    });
  }
  else {
    res.redirect('/login');
  }
});

app.get('/edit', function(req, res){
    if (req.session.user == null)
  {
    // if user is not logged-in redirect back to login page
    res.redirect('/login');
  }
  else {
    DB.getDecksByUserId(req.session.user._id, function(e, decks){
      if (decks == '') {
        res.render('edit.jade', {
            'user': JSON.stringify(req.session.user), // remove this!
            'deck_name': 'You have 0 decks',
            'deck_id': null,
            'decks': new Array(),
            'slides': new Array()
          });
      }
      else if (req.query.deckid) {
        DB.getDeckById(req.query.deckid, function(e, cur_deck){
          DB.getSlidesByDeckId(cur_deck._id, function(e, slides){
            slides = slides.sort(compare);
            //console.log(JSON.stringify(slides));
            req.session.deckid = cur_deck._id;
            res.render('edit.jade', {
              'user': JSON.stringify(req.session.user), // remove this!
              'deck_name': cur_deck.name,
              'deck_id': cur_deck._id,
              'decks': decks,
              'slides': slides
            });
          });
        });
      }
      else {
        DB.getMostRecentDeck(req.session.user._id, function(e, cur_deck){
          DB.getSlidesByDeckId(cur_deck._id, function(e, slides){
            slides = slides.sort(compare);
            //console.log(JSON.stringify(slides));
            req.session.deckid = cur_deck._id;
            res.render('edit.jade', {
              'user': JSON.stringify(req.session.user), // remove this!
              'deck_name': cur_deck.name,
              'deck_id': cur_deck._id,
              'decks': decks,
              'slides': slides
            });
          });
        });
      }
    });
  }
});

function compare(a, b){
  if (a.pos < b.pos)
    return -1;
  if (a.pos > b.pos)
    return 1;
  return 0;
}

app.post('/edit', function(req, res){
  if (req.session.user == null)
  {
    // if user is not logged-in redirect back to login page
    res.redirect('/login');
    console.log("//BUG - THIS DOESNT REDIRECT! reason is because this is an app.post a post, not trying to load a page");  
    //BUG - THIS DOESNT REDIRECT! reason is because this is an app.post a post, not trying to load a page
  }
  else
  {
    if (req.session.deckid == null) {
      //create a deck to insert into
    }
    else {
      var len = req.files.file.length;
      if (len == null){
        if (isImage(req.files.file.path)) {
            var file_path = req.files.file.path.replace(/.*public/, '');
            var slide_position = "";
            DB.createSlide(file_path, req.session.user._id, req.session.deckid, slide_position, function(err, new_slide){
              //success check
            });
          }
          else {
            res.send('not-image',400);
          }
      }
      else {
        for (var i = 0; i < len; i++) {
          if (isImage(req.files.file[i].path)) {
            var file_path = req.files.file[i].path.replace(/.*public/, '');
            var slide_position = parseInt(req.files.file[i].name.replace(/\D/g, ""));
            console.log("router pos: "+slide_position);
            DB.createSlide(file_path, req.session.user._id, req.session.deckid, slide_position, function(err, new_slide){
              //success check
              });
          }
          else {
            res.send('not-image',400);
          }
        }
      }
      DB.fixSlideOrder(req.session.deckid); // BUG
      res.redirect('/edit?deckid=' + req.session.deckid);
    }
  }

    //if file is pptx
    //call insert pptx

});

app.get('/updateKeywords', function(req, res){
  if (req.query.slideid != 'undefined' && req.query.keywords != 'undefined') {
    var keywords_arr = req.query.keywords.replace(/%02/g," ").split(',');
    DB.updateKeywords(req.query.slideid, keywords_arr, function(e, count){
      if (count == 1)
      {
        res.send(200);
      }
      else { res.send("update-error",200); }
    });
  }
  else {
    res.send('invalid-keywork-update-request',400);
  }
});


app.get('/testquery', function(req, res){
  if (req.session.user == null){
  // if user is not logged-in redirect back to login page //
    res.redirect('/login'); 
  }   
  else {
    DB.getDecksByUserId(req.session.user._id, function(e, test_result){
      // console.log(test_result);
      res.send(test_result);
    });
  }
});

app.get('/createEmptyDeck', function(req, res) {
  if (req.session.user == null) {
    res.send('no-user-logged-in', 400);
  }   
  else {
    DB.createEmptyDeck(req.session.user._id, function(e, deck){
      res.redirect('/edit?deckid=' + deck[0]._id);
    });
  }
});

app.get('/deleteDeckById?*', function(req, res){
  DB.deleteDeckById(req.query.id);
});

  app.get('*', function(req, res) { res.render('404.jade', { title: 'Page Not Found'}); });
};

/*                            */
/*                            */
/*                            */
/*                            */
/*      auxilary methods      */
/*                            */
/*                            */
/*                            */
/*                            */

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
        //etc
        return true;
    }
    return false;
}

