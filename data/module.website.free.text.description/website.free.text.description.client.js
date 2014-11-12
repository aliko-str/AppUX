(function() {
	"use strict";
	var ap = window.AppUX;
	var imgToLoad = {
	};
	var cssToLoad = ["side.libs/bootstrap.min.css", ap.folder + "main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}

	(function setUpTexts(website, task) {
		$("#websUrl").attr("href", website.href).text(website.hostname);
		$("#taskText").text(task.text);
		$("form").submit(function(ev) {
			ev.preventDefault();
			var textsToSubmit = $(this).find("textarea[name='descriptions']").val().split(";");
			submitWithDelay(this, function(){
				ap.port.emit("data", {
					hostname: website.hostname,
					descriptors: textsToSubmit
				});
				ap.port.emit("next", "Let's roll!!");
				return;
			});
			return;
		});
	})(ap.options.website, ap.options.task);

})();
