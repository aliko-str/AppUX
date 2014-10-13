(function() {
	var ap = window.AppUX;
	var imgToLoad = {
		"google.logo" : "logo.png",
		"google.settings": "settings.button.png",
		"further.pages": "further.pages.png"
	};
	var cssToLoad = ["main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++){
		ap.loadImage(_keys[i], ap.baseUrl + ap.folder + "google.files/" + imgToLoad[_keys[i]], function(){});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++){
		ap.loadCss(ap.baseUrl + ap.folder + cssToLoad[i]);
	}
	window.document.getElementById("finish.google.experience").onclick = function(ev){
		ap.port.emit("next", "let's roll!");
	};
})();
