window.onbeforeunload = function(e) {
	var mess = "The UX evaluation hasn't been finished - the data you've entered will be lost if you leave now.";
	e.returnValue = mess;
	return mess;
};

self.port.on("done", function() {
	window.onbeforeunload = null;
});

self.port.emit("injected", "on.close.warning.js");