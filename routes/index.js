var express = require('express');
var router = express.Router();

// index.js //
var path = require("path");
var fs = require('fs');

var app = require('express')();

// Creating variables //
var soundbank = [];
var playlist = [];
var musicPath = "C:\\Users\\Arthur\\Music";

createSoundBank();

var multer = require('multer');
// Handles the upload of a file in ./uploads folder //
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		console.log(file.originalname);
		if (file.mimetype == "audio/mp3") {
			cb(null, file.originalname);
		}
		else{
			cb(new Error('File format is not mp3'))
		}
	}
});

var upload = multer({ storage: storage });

router.post('/upload', upload.any(), function (req, res, next) {
	console.log("I'm in post");
	//io.emit('upload', "file uploaded");
	res.send();
});

// Handles function related request from the client
router.get('/getTableSoundBank',function(req,res){
  res.send(formatSoundBankHTML(soundbank));
});
router.get('/getTablePlaylist',function(req,res){
	res.send(formatPlaylistHTML(playlist));
});

// Handle request to add and remove one song
router.get('/addToPlaylist/:song',function(req,res){
	var addSong = req.params.song;
	console.log("User want "+addSong+" to be added!");
	addToPlaylist(addSong);
	res.send(addSong+"Has been added");
});
router.get('/removeFromPlaylist/:song',function(req,res){
	var rmSong = req.params.song;
	console.log("User want "+rmSong+" to be removed!");
	removeFromPlaylist(rmSong);
});

// startStream fills in <audio src="***.mp3"> with top playlist song
// src="***.mp3" then sends automatically a GET which starts the stream
router.get('/startStream',function(req,res){
	if (typeof playlist[0] != "string"){
		res.send("No song in the playlist");
	}
	else{
		res.send(playlist[0]);
	}
});
router.get('/*.mp3',function(req,res){
	console.log("SONG ASKED: "+req.url);

	var stream = fs.createReadStream(musicPath + req.url);
	stream.on('error', function(){
		console.log("the file doesn't exist");
	})
	.pipe(res);
});



// Request not handled
router.use(function(req, res, next) {
	res.status(404).send("Sorry, that route doesn't exist. Have a nice day though :)");
});


// Creates the sound bank based on musics in musicPath
function parseExtension(url) {
	return url.split('.').pop();
};
function createSoundBank() {
	var files = fs.readdirSync(musicPath);
	for (var i = 0; i < files.length; i++) {
		if(parseExtension(files[i]) == "mp3"){
			soundbank.push(files[i]);
		}
	}
	return true
};
function addToPlaylist(song) {
	playlist.push(song);
	console.log("New Playlist (add): "+playlist);
};
function removeFromPlaylist(song) {
	var i = playlist.indexOf(song);
	if(i != -1) {
		// array.splice(indexOfXursor, howManyRemoved, Additem1, ....., AdditemX)
		playlist.splice(i, 1);
	}
};
function formatSoundBankHTML(songs) {
	var result ="";
	for (var i = 0; i < songs.length; i++) {
		if (i%2 == 0) {
			var background = "white";
		}
		else var background = "lightgrey";

		result += '<tr style="background: '+background+';" id="orderID_'+i+'"><td headers="song">'+songs[i]+'</td>'+
		'<td headers="artist">Artist (parsage pas fait)</td>'+
		'<td headers="client">Client</td>'+
		'<td headers="client" style="cursor: pointer;" onclick="addToPlaylist(\''+songs[i]+'\');">Add song to The Playlist</td></tr>';
	}
	return result;
};
function formatPlaylistHTML(list) {
	var result ="";
	for (var i = 0; i < list.length; i++) {
		if (i%2 == 0) var background = "white";

		else var background = "lightgrey";

		result += '<tr style="background: '+background+';" id="orderID_'+i+'">'+'<td headers="playOrder">'+(i+1)+'</td>'+
		'<td headers="song">'+list[i]+'</td>'+
		'<td headers="artist">Artist (parsage pas fait)</td>'+
		'<td headers="client">Client</td>'+
		'<td headers="client" style="cursor: pointer;" onclick="removeFromPlaylist(\''+list[i]+'\'); getTablePlaylist();">Remove song from The Playlist</td></tr>';
	}
	return result;
};

module.exports = router;
