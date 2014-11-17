(function() {
	var _getHostName = (function(elA) {
		return function(href) {
			elA.href = href;
			return elA.hostname;
		};
	})(document.createElement("a"));
	// detect internal links and ignore them in onHashChange
	var internalHashStore = {};
	for(var els = document.getElementsByTagName('a'), i = els.length; i--; ) {
		if(els[i].hash) {
			internalHashStore[els[i].hash] = true;
		}
	}
	// a) window.onload
	function checkState() {
		var isVisited = false;
		if(window.history.state && window.history.state["AppUX.visited"] === true) {
			isVisited = true;
		} else {
			window.history.replaceState({
				"AppUX.visited" : true
			}, window.document.title, window.location.href);
		}
		self.port.emit("history.visit", {
			baseUrl : window.location.hostname,
			url : window.location.href,
			revisit : isVisited,
			referrer : document.referrer,
			referrerBaseUrl: _getHostName(document.referrer)
		});
		return isVisited;
	}

	checkState();
	// b) location.onhashchange
	window.onhashchange = function(ev) {
		if(internalHashStore[window.location.hash]) {
			// internal link - ignore it
			return;
		}
		if(checkState()) {
			console.log("Hash Changed to a revisited Hash");
		} else {
			console.log("Hash Changed to a new value");
		}
	};
})();
