/* main.js */

var socket = io();

$(window).on('load', function() {
	getTablePlaylist();
});

$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

function show(tab) {
	if(tab == "sounbank"){
		getTableSoundBank();
		document.getElementById('pageTitle').innerHTML = "SoundBank";
	}
	else if(tab == "playlist"){
		getTablePlaylist();
		if (document.getElementById('liveSong').innerHTML == "") {
			startStream();
		}
	}
	else{
	}
	return false;
};
