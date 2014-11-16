window.onbeforeunload = function(e) {
	var mess = "The UX evaluation hasn't been finished - the data you've entered will be lost if you leave now.";
	e.returnValue = mess;
	return mess;
};

function onUnloadListener(ev){
	self.port.emit("test.flow.interrupted");
	return;
}

window.addEventListener("unload", onUnloadListener);

self.port.on("done", function() {
	window.onbeforeunload = null;
	window.removeEventListener("unload", onUnloadListener);
});

self.port.emit("injected", "on.close.warning.js");