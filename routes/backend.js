 exports.backend = function(req, res){

   res.render('index', { title: 'Show and Tell' });
  console.log(req.query.body);

  var ls = "";
  var files ="";
   var command = "ls ./public/uploads/";

   child = exec(command, function (error, stdout, stderr) {
      console.log("command: "+command);
      console.log('stdout: ' + stdout);
      ls = stdout;
      console.log("ls: " +ls);
      files = ls.split(path.sep);
      console.log("files: "+files);
   });
   // $('img#visuals').attr('src',"images/happy.jpg");


   //FILE INCOMPLETE AND NOT USED
};

