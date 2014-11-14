(function() {
	"use strict";
	var ap = window.AppUX;
	var imgToLoad = {
		"loaderImg" : ap.folder + "ajax-loader.gif"
	};
	var cssToLoad = ["side.libs/bootstrap.min.css", ap.folder + "main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	window.document.getElementById("finishReading").onclick = function(ev) {
		ap.port.emit("next", "let's roll!");
	};
	
	
	$("#tryAgainButton").click(function(ev){
		ap.port.emit("try.again");
		$(".loader-box > *").hide();
		$(".saving-now").show();
	});
	ap.port.on("save.error", function(err){
		$("#errorText").text(err);
		$(".loader-box > *").hide();
		$(".saving-error").show();
	});
	ap.port.on("save.success", function(msg){
		$(".loader-box > *").hide();
		$(".saving-error").show();
	});
})();
