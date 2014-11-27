(function() {
	var ap = window.AppUX;
	var imgToLoad = {
	};
	var cssToLoad = ["side.libs/bootstrap.min.css", ap.folder + "main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++){
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function(){});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++){
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	ap.port.on("error.data", function(message){
		$("#errorMessage").text(message).show();
	});
	ap.port.on("success.data", function(){
		// I may want to show a message here;
		ap.port.emit("next", "let's roll!");
	});
	$("form").submit(function(ev){
		ev.preventDefault();
		var idEl = $(this).find("#theID");
		var id = idEl.val();
		try{
			id = parseInt(id, 10);
		}catch(e){
			ap.port.emit("error", e);
			idEl.addClass("has-error");
			return idEl.val("").attr("placeholder", "has to be a number").blur();
		}
		idEl.removeClass("has-error").addClass('has-success');
		ap.port.emit("data", id);
	});
})();
