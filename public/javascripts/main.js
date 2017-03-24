/* main.js */

var socket = io.connect('http://localhost:4000');

$(window).on('load', function() {
	getTablePlaylist();
	startStream();
});

// Switches tabs: hide + init page
$(document).ready(function() {
	$('.tabs .tab-links a').on('click', function(e)  {
		var currentAttrValue = jQuery(this).attr('href');
		// Show/Hide Tabs
		jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
		// Change/remove current tab to active
		jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
		e.preventDefault();
	});
});

function show(tab) {
	if(tab == "sounbank"){
		getTableSoundBank();
		document.getElementById('pageTitle').innerHTML = "SoundBank";
	}
	else{
		getTablePlaylist();
		if (document.getElementById('liveSong').innerHTML == "") {
			startStream();
		}
	}
	return false;
};
