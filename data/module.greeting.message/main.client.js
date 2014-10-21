(function() {
	var ap = window.AppUX;
	var imgToLoad = {
		"drag.drop.examp.img" : "module.greeting.message/stub.drag.drop.png"
	};
	var cssToLoad = ["side.libs/bootstrap.min.css", "module.greeting.message/main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++){
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function(){});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++){
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	window.document.getElementById("begin.evaluating.button").onclick = function(ev){
		ap.port.emit("next", "let's roll!");
	};
})();
