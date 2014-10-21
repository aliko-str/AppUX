(function() {
	// a) window.onload
	function checkState(){
		var isVisited = false;
		if(window.history.state && window.history.state["AppUX.visited"] === true) {
			self.port.emit("history.revisit", {
				baseUrl : window.location.hostname
			});
			isVisited = true;
		} else {
			window.history.replaceState({"AppUX.visited": true}, window.document.title, window.location.href);
		}
		return isVisited;
	}
	checkState();
	// b) location.onhashchange
	window.onhashchange = function(ev){
		if(checkState()){
			console.log("Hash Changed to a revisited Hash");
		}else{
			console.log("Hash Changed to a new value");
		}
	};
})();
