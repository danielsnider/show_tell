/*
 * after POST file upload occures process the file
 */

exports.user_file_upload = function(req, res) {

	if (req.files.file)  {
		console.log("Recieved file: \n " + req.files.file);
		// do something
	}
}

