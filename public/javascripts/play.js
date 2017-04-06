/*play.js*/

////////////////////////////////////////////////////////////////////////
//////////////////  Playlist/Music Stream Code  //////////////////////////
///////////////////////////////////////////////////////////////////////
var musicPath = "C:\\Users\\Arthur\\Music";

var player = document.getElementById("player");


// Respond to the Next Song button
function emitNextSong() {
	socket.emit('server play next song');
}

// Listen to the end of a song
player.onended = function() {
	emitNextSong();
};

// Server sends the song to play
socket.on('play', function(song) {
	play(song);
	getTablePlaylist();
})

function play(song) {
	document.getElementById('player').src = song;
	document.getElementById('liveSong').innerHTML = song;
};

// Plays the top song of the playlist
function startStream() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/startStream");
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			console.log("isPlaying: "+isPlaying);
			if(xhr.responseText != "No song in the playlist"){
				play(xhr.responseText);
			}
			console.log("here: "+xhr.responseText);
			document.getElementById('liveSong').innerHTML = xhr.responseText;
		}
	});
	xhr.send();
};

function getTablePlaylist() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/getTablePlaylist");
	xhr.addEventListener('readystatechange', function() { 
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			document.getElementById('tbody1').innerHTML = xhr.responseText;
		}
	});
	xhr.send();
};


///////////////////////////////////////////////////////////////////////
///////////////////  SoundBank Code  //////////////////////////////////
///////////////////////////////////////////////////////////////////////

function getTableSoundBank() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/getTableSoundBank");
	xhr.addEventListener('readystatechange', function() { 
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			document.getElementById('tbody2').innerHTML = xhr.responseText;
		}
	});
	xhr.send();
};

function addToPlaylist(song) {
	var xhr = new XMLHttpRequest();
	if(document.getElementById('liveSong').innerHTML == "No song in the playlist"){ 
		var isSongPlaying = false;
	}	
	else var isSongPlaying = true;
	
	console.log("IS SONG PLAYING: "+ isSongPlaying);
	console.log("IS SONG LIVESONG: "+ document.getElementById('liveSong').innerHTML);

	xhr.open('GET', "/addToPlaylist/"+song+"/"+isSongPlaying);
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			console.log(xhr.responseText+" = MESSAGE RECIEVED");
			if (xhr.responseText != "song added"){
				socket.emit("chat message", "No song, Must Play" + xhr.responseText);
				socket.emit("play", xhr.responseText);
			}
			else{
				console.log("Song has been added to the playlist");
			}
			
		}
	});
	xhr.send();
};

function removeFromPlaylist(song) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/removeFromPlaylist/"+song);
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			getTablePlaylist();
		}
	});
	xhr.send();
};