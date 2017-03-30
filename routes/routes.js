// index.js //
var express = require('express');
var router = express.Router();
var mod = require('../own_modules/mod');
var fs = require('fs');

// Creating variables //
var soundbank = mod.soundbank;
var playlist = mod.playlist;
var musicPath = mod.musicPath;

mod.createSoundBank();

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
    res.send(mod.formatSoundBankHTML(soundbank));
});
router.get('/getTablePlaylist',function(req,res){
	res.send(mod.formatPlaylistHTML(playlist));
});

// Handle request to add and remove one song
router.get('/addToPlaylist/:song',function(req,res){
	var addSong = req.params.song;
	console.log("User want "+addSong+" to be added!");
	mod.addToPlaylist(addSong);
	res.send(addSong+"Has been added");
});
router.get('/removeFromPlaylist/:song',function(req,res){
	var rmSong = req.params.song;
	console.log("User want "+rmSong+" to be removed!");
	mod.removeFromPlaylist(rmSong);
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

module.exports = router;
