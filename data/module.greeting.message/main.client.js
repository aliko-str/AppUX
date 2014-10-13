(function() {
	console.log("hi");
	console.log("hi2");
	console.log("hi3");
	console.log("hi4");
	var ap = window.document.AppUX;
	var scriptsToLoad = ["shared/jquery-2.0.3.min.js", "shared/jquery-ui-1.10.3.custom.min.js", "shared/jquery.ui.touch-punch.min.js", "shared/bootstrap.min.js", "shared/bootstrap-select.js", "shared/bootstrap-select.js", "shared/bootstrap-switch.js", "shared/bootstrap-switch.js"];
	var cssToLoad = ["shared/bootstrap.min.css", "module.greeting.message/main.css"];
	var imgToLoad = {
		"always.open.img" : "module.greeting.message/always.open.png",
		"drag.drop.examp.img" : "module.greeting.message/stub.drag.drop.png",
		"begin.evaluating.button" : "module.greeting.message/next.button.png"
	};
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++){
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function(){});
	}
	var onJsLoadCallback = function() {
		var nextJsUrl = scriptsToLoad.shift();
		if(nextJsUrl) {
			ap.loadJsFile(ap.baseUrl + nextJsUrl, onJsLoadCallback);
		} else {
			onAllJsLoaded();
		}
	};
	ap.loadJsFile(ap.baseUrl + scriptsToLoad.shift(), onJsLoadCallback);
	var onAllJsLoaded = function() {
		window.alert("Hello world!");
		window.document.getElementById("begin.evaluating.button").onclick = function(ev){
			ap.port.emit("next", "let's roll!");
		};
	};
})();
