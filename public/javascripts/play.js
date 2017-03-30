/*play.js*/

////////////////////////////////////////////////////////////////////////
//////////////////  Playlist/Music Stream Code  //////////////////////////
///////////////////////////////////////////////////////////////////////
var musicPath = "C:\\Users\\Arthur\\Music";

var player = document.getElementById("player");
//var countPlaylist = 0;

// Sends a message requesting to go to the next song
function emitNextSong() {
	// Remove the top song from the playlist (currently playing)
	var str = document.getElementById('liveSong').innerHTML;
	removeFromPlaylist(str.toString());
	document.getElementById('liveSong').innerHTML = "";
	//countPlaylist --;

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
	//countPlaylist --;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/removeFromPlaylist/"+song);
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
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
				//return xhr.responseText;
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
	socket.emit('new song', song);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/addToPlaylist/"+song);
	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
			if (document.getElementById('liveSong').innerHTML == "") {
				nextSong();
			}
		}
	});
	xhr.send();
};
