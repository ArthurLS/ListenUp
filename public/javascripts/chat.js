/*chat.js*/

///////////////////////////////////////////////////////////////////////
//////////////////////  Chat Action //////////////////////////////////
///////////////////////////////////////////////////////////////////////

var msgInChat = 0;
var alterBackMessage =0;

// Sends the message to the server when submitted
$('#subMsg').click(function(){
	socket.emit('chat message', $('#chat_input').val());
	$('#chat_input').val('');
	return false;
});
// Listen to chat messages from the server (andd writes them)
socket.on('chat message', function(msg){
	alterBackMessage++;
	if (alterBackMessage%2 == 0) {
		$('#messages').append($('<li class="msg" style="background: white;">').text(msg));
	}
	else{
		$('#messages').append($('<li class="msg" >').text(msg));
	}
	msgInChat++;
	if (msgInChat > 5){
		delOldMessage();
	}
});

// Limit the number of message displayed
function delOldMessage() {
	var myElement = document.getElementById('messages');
	var firstChild = document.getElementById('messages').firstChild;
	myElement.removeChild(firstChild);
};
