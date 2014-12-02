window.onbeforeunload = function(e) {
	var mess = "The UX evaluation hasn't been finished - the data you've entered will be lost if you leave now.";
	e.returnValue = mess;
	return mess;
};

var onUnloadListener = (function(self) {
	return function() {
		self.port.emit("test.flow.interrupted");
		console.log("UNLOADING");
		// TODO the event doesn't work -- implement a way around it
		return;
	};
})(self);

window.onunload = function() {
};

window.addEventListener("unload", onUnloadListener);

self.port.on("done", function() {
	window.onbeforeunload = null;
	window.removeEventListener("unload", onUnloadListener);
});

self.port.emit("injected", "on.close.warning.js");
