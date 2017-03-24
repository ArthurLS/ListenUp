/*upload.js*/

///////////////////////////////////////////////////////////////////////
///////////////////  Song Upload Code  //////////////////////////////////
///////////////////////////////////////////////////////////////////////

socket.on('upload', function(msg){
	document.getElementById('file_upload').innerHTML = "Your file has been uploaded!";
});

/* Input File js */
// ajout de la classe JS à HTML
document.querySelector("html").classList.add('js');
 
// initialisation des variables
var fileInput  = document.querySelector(".input-file"),  
    button     = document.querySelector(".input-file-trigger"),
    the_return = document.querySelector(".file_return");
 
// action lorsque le label est cliqué
button.addEventListener( "click", function( event ) {
   fileInput.focus();
   return false;
});
 
// affiche un retour visuel dès que input:file change
fileInput.addEventListener( "change", function( event ) {  
    the_return.innerHTML = this.value;  
});

// Security
$('#submit').on('keyup keypress', function(e) {
	var keyCode = e.keyCode || e.which;
	if (keyCode === 13) { 
		e.preventDefault();
		return false;
	}
});
