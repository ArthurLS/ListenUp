/*play.js*/

////////////////////////////////////////////////////////////////////////
//////////////////  Playlist/Music Stream Code  //////////////////////////
///////////////////////////////////////////////////////////////////////
var musicPath = "uploads";

var player = document.getElementById("player");


// Listens "Next Song" button
// Sends a message to the server to play the next song
function emitNextSong() {
	socket.emit('server play next song');
}

// Listen to the end of a song
player.onended = function() {
	emitNextSong();
};

// When the client receive 'play' message,
// it plays the song he received and updates the UI
socket.on('play', function(song) {
	play(song);
	getTablePlaylist();
})

// Updates the UI and song
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

// Fetch the playlist from the server and displays it
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

// Fetch the soundBank from the server and displays it
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

// When the player wants to add a song to the playlist:
// GET request with the song he wants to add and if a song is playing or not
// 1) If there is no song playing. The server sends a mesage to everyone to play it
// 2) Else, song is added to the playlist
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

// Removes a song from the playlist
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