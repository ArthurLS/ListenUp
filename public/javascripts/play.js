/*play.js*/

////////////////////////////////////////////////////////////////////////
//////////////////  Playlist/Music Stream Code  //////////////////////////
///////////////////////////////////////////////////////////////////////
var musicPath = "C:\\Users\\Arthur\\Music";

var player = document.getElementById("player");

// Sends a message requesting to go to the next song
function emitNextSong() {
	// Remove the top song from the playlist (currently playing)
	var str = document.getElementById('liveSong').innerHTML;
	removeFromPlaylist(str.toString());

	// Send the message to server
	socket.emit('next song', 'next song');
}

player.onended = function() {
	emitNextSong();
};

// Listen to the server to play the next song
socket.on('next song', function(){
	nextSong();
});
function nextSong() {
	// Plays the first dong in the playlist
	startStream();
	getTablePlaylist();
};

function play(songName) {
	document.getElementById('player').src = songName;
};

function removeFromPlaylist(song) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/removeFromPlaylist/"+song);
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			console.log(xhr.responseText+" has been removed to the playlist");
			getTablePlaylist();
		}
	});
	xhr.send();
};

// Plays the top song of the playlist
function startStream() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/startStream");
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			if(xhr.responseText != "No song in the playlist"){
				console.log("Current Song is: "+ xhr.responseText);
				play(xhr.responseText); 
				document.getElementById('liveSong').innerHTML = xhr.responseText;
				return xhr.responseText;
			}
			else{
				console.log("No song in the playlist")
			}
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
	xhr.open('GET', "/addToPlaylist/"+song);
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			console.log(xhr.responseText+" has been added to the playlist");
			if (document.getElementById('liveSong').innerHTML == "") {
				startStream();
			}
		}
	});
	xhr.send();
};
