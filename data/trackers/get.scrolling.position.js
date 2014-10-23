(function() {
	function isTopScreen(windowSize, scrollPosition) {
		return (scrollPosition < windowSize/2);
	}
	self.port.emit("position", {
		isTop : isTopScreen(window.innerHeight, window.pageYOffset)
	});
})();
