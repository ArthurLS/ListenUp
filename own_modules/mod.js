/*methods.js*/
// This is where all the global functions are created and exported
var fs = require('fs');

// Creating variables //
var soundbank = [];
var playlist = [];
const musicPath = "C:\\Users\\Arthur\\Music";
// export them
exports.soundbank = soundbank;
exports.playlist = playlist;
exports.musicPath = musicPath;

// Creates the sound bank based on musics in musicPath
function parseExtension(url) {
	return url.split('.').pop();
};
exports.parseExtension = function(url) {
	return url.split('.').pop();
};

exports.createSoundBank = function() {
	var files = fs.readdirSync(musicPath);
	for (var i = 0; i < files.length; i++) {
		if(parseExtension(files[i]) == "mp3"){
			soundbank.push(files[i]);
		}
	}
	return true
};

exports.addToPlaylist = function(song) {
	playlist.push(song);
	console.log("New Playlist (add): "+playlist);
};

exports.removeFromPlaylist = function(song) {
	var i = playlist.indexOf(song);
	if(i != -1) {
		// array.splice(indexOfXursor, howManyRemoved, Additem1, ....., AdditemX)
		playlist.splice(i, 1);
		console.log("New Playlist (rm): "+playlist);
	}
	else console.log("False rm request on: "+ song);
};

exports.formatSoundBankHTML = function(songs) {
	var result ="";
	for (var i = 0; i < songs.length; i++) {

		result += '<tr id="orderID_'+i+'">'+
		'<td >'+songs[i]+'</td>'+
		'<td>Artist (parsage pas fait)</td>'+
		'<td style="cursor: pointer;" onclick="addToPlaylist(\''+songs[i]+'\');"> <img class="imgAddRm" src="/img/add_song.png"> </td></tr>';
	}
	return result;
};

exports.formatPlaylistHTML = function(list) {
	var result ="";
	for (var i = 0; i < list.length; i++) {

		result += '<tr id="orderID_'+i+'">'+'<td >'+(i+1)+'</td>'+
		'<td>'+list[i]+'</td>'+
		'<td>Regarde la chanson bolosse</td>'+
		'<td style="cursor: pointer;" onclick="removeFromPlaylist(\''+list[i]+'\'); getTablePlaylist();"><img class="imgAddRm" src="/img/rm_song.png"></td></tr>';
	}
	return result;
};
