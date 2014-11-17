(function() {
	"use strict";
	function isTopScreen(windowSize, scrollPosition) {
		return (scrollPosition < windowSize / 2);
	}
	var _isTopThen = isTopScreen(window.innerHeight, window.pageYOffset);
	var _isTopNow = _isTopThen;
	var timer;
	window.addEventListener("scroll", function(ev) {
		if(timer) {
			// clear the timer, if one is pending
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(onScrollHandler, 100);
	});
	
	function onScrollHandler(){
		_isTopNow = isTopScreen(window.innerHeight, window.pageYOffset);
		if(_isTopNow != _isTopThen){
			self.port.emit("is.top.changed", {
				isTop : _isTopThen,
				baseUrl : window.location.hostname,
				url : window.location.href
			});
		}
		_isTopThen = _isTopNow;
	}
})();
