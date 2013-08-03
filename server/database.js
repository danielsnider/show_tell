
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'show_tell';

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

/* establish the database connection */

var db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database: ' + dbName);
	}
});

var accounts = db.collection('accounts');
var decks = db.collection('decks');
var groups = db.collection('groups');
var slides = db.collection('slides');

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					console.log(o);
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
						// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, function(err, accountInserted){
							createDefaultDeck(accountInserted[0]._id.toString(), callback); 
							}
						);
					});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, callback);
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}

/*                            */
/*                            */
/*                            */
/*                            */
/*     edit deck methods      */
/*                            */
/*                            */
/*                            */
/*                            */

var createDefaultDeck = function(user_id, callback)
{
	date = moment().format('MMMM Do YYYY, h:mm:ss a');

	//create default deck 
	var default_deck = { name : "Default Deck", 
					 owner_id : user_id, 
					 date_created : date, 
 					 date_modified : date };

	decks.insert(default_deck, {safe: true}, function(err, deck) {

	 	//create welcome slide
	 	var default_slide = { 
	 		owner_id : user_id, 
	 		deck_id : deck[0]._id.toString(),
			resource : "/img/welcome.png", 
			keywords : ["welcome", "show and tell", "show", "tell"], 
			type : "img",
	 		pos : "1", //PUT AS INT?
			date_created : date, 
	 		date_modified : date };

		slides.insert(default_slide, {safe: true}, callback);
	});
}

exports.getDecksByUserId = function(user_id, callback) 
{
	decks.find({ 'owner_id': user_id }, {'sort':'pos'}).toArray(callback);
}

exports.getDeckById = function(deck_id, callback) 
{
	decks.findOne({ '_id': getObjectId(deck_id) }, callback);
}

exports.getMostRecentDeck = function (user_id, callback){
	decks.findOne({'owner_id': user_id }, {'sort':'date_modified'}, callback);
}

exports.getSlidesByDeckId = function(deck_id, callback) 
{
	slides.find({ 'deck_id': deck_id.toString() }).toArray(callback);
}

exports.getSlidesByOwnerId = function(owner_id, callback) 
{
	slides.find({ 'owner_id': owner_id }).toArray(callback);
}

exports.createEmptyDeck = function (user_id, callback) {
	date = moment().format('MMMM Do YYYY, h:mm:ss a');

	//create empty deck 
	var deck = { 
		name : "New Deck", 
		owner_id : user_id, 
		date_created : date, 
 		date_modified : date };

	//insert empty deck
	decks.insert(deck, {safe: true}, callback);
}

exports.deleteDeckById = function(id){
	decks.remove({'_id': getObjectId(id)},function(err, count){
		//success check
	});
}

exports.createSlide = function(file_path, user_id, deck_id, pos, callback) {
	date = moment().format('MMMM Do YYYY, h:mm:ss a');

	console.log("database.js pos:"+pos);
	maxPosition(deck_id, function(max_pos){
		//var set_pos = (pos == "") ? max_pos + 1 : max_pos + pos;
		console.log("database.js max_pos:"+max_pos);
		var set_pos = pos;
		console.log("database.js set_pos:"+set_pos);
		var slide = { 
			owner_id : user_id, 
	 		deck_id : deck_id,
			resource : file_path, 
			keywords : [], 
			type : "img",
	 		pos : parseInt(set_pos), 
			date_created : date, 
	 		date_modified : date 
	 	};

		slides.insert(slide, {safe: true}, callback);
	});
}

// exports.createSlide = function(file_path, user_id, deck_id, callback) {
// 	date = moment().format('MMMM Do YYYY, h:mm:ss a');
  
// 	maxPosition(deck_id, function(max_pos){
// 		var pos = max_pos + 1;
// 		var slide = { 
// 			owner_id : user_id, 
// 	 		deck_id : deck_id,
// 			resource : file_path, 
// 			keywords : [], 
// 			type : "img",
// 	 		pos : pos, 
// 			date_created : date, 
// 	 		date_modified : date };

// 		slides.insert(slide, {safe: true}, callback);
// 	});
// }

exports.updateKeywords = function(slide_id, keywords, callback) {
	date = moment().format('MMMM Do YYYY, h:mm:ss a');

	slides.update({ '_id' : getObjectId(slide_id) }, {$set: {keywords: keywords, date_modified: date}}, callback);
}

//exports.maxPosition = function(deck_id, keywords, callback) {
function maxPosition(deck_id, callback) {
	var max = -1;
	slides.find({ 'deck_id': deck_id.toString() }, {}, {safe: true}).toArray( function(err, slides_out){
		console.log("slides_out:"+JSON.stringify(slides_out));
		console.log("slides_out.length:"+slides_out.length);
		for (var i = 0; i < slides_out.length; i++) {
			console.log("slides_out[i].pos:"+slides_out[i].pos);
			if (parseInt(slides_out[i].pos) > max) { max = slides_out[i].pos; }
		};
		callback(max);
	});
} 

exports.fixSlideOrder = function(deck_id) {
	slides.find({ 'deck_id': deck_id.toString() }, {safe: true}).toArray( function(err, slides_out){
		// var exec = require('child_process').exec, child;
		// var count = -1;
		// slides_out.forEach( function (slide){
		// 	count++;
		// 	command = 'mongo show_tell --eval  \'db.slides.update({ _id : "' +slide._id+ '" }, {$set: {pos: "'+count+'"}}, {safe: true})\'';
		// 	child = exec(command, function (error, stdout, stderr) {
		// 		console.log("command: "+command);
		//       	console.log('stdout: ' + stdout);
		//     });
		// });
		// console.log(slides_out);
		// console.log(JSON.stringify(slides_out));
		// for (var i = 0; i < slides_out.length; i++) {
		// 	slides.update({ '_id' : slides_out[i]._id }, {$set: {pos: i}}, {safe: true}, function(err, o) {
		// 	});
		// };

		// slides.find({ 'deck_id': deck_id.toString() }).toArray( function(err, slides){
	});
}