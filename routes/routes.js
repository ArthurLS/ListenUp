// routes.js //
// Handle the request from the clients //

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

// A lot the the functions used here are actually defined in this file
var mod = require('../own_modules/mod');


// Creating variables //
var soundbank = mod.soundbank;
var playlist = mod.playlist;
var musicPath = mod.musicPath;

// Creates the list of songs from your local files
mod.createSoundBank();


// Handles the upload of a file in ./uploads folder //
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'C:\\Users\\Arthur\\Music');
	},
	filename: function (req, file, cb) {
		console.log(file.originalname);
		if (file.mimetype == "audio/mp3") {
			cb(null, file.originalname);
			// Creates the list of songs from your local files
			mod.createSoundBank();
		}
		else{
			cb(new Error('File format is not mp3'))
		}
	}
});

var upload = multer({ storage: storage });

router.post('/upload', upload.any(), function (req, res, next) {
	console.log("I'm in post");
	res.send();
});


// Handles HTML render request
router.get('/getTableSoundBank',function(req,res){
	res.send(mod.formatSoundBankHTML(soundbank));
});
router.get('/getTablePlaylist',function(req,res){
	res.send(mod.formatPlaylistHTML(playlist));
});


// Handle request to add and remove one song
router.get('/addToPlaylist/:song/:isSongPlaying',function(req,res){
	var song = req.params.song;
	var bool = (req.params.isSongPlaying == 'true');

	if(!bool){ // If not Playing
		res.send(song);	
	}
	else{
		console.log("Song has been added to the playlist");
		mod.addToPlaylist(song);
		res.send("song added");
	}
});
router.get('/removeFromPlaylist/:song',function(req,res){
	var rmSong = req.params.song;
	console.log("User want "+rmSong+" to be removed!");
	mod.removeFromPlaylist(rmSong);
});


// startStream fills in <audio src="***.mp3"> with the top playlist song
// src="***.mp3" then sends automatically a GET request which starts the stream
router.get('/startStream',function(req,res){
	if (typeof playlist[0] != "string"){
		res.send("No song in the playlist");
	}
	else{
		res.send(playlist[0]);
	}
});
//answers src"***.mp3" from the client
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

module.exports = router;
