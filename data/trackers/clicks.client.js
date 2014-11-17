(function() {
	// make sure website scripts don't overwrite document.onClick
	var checkPassed = false;
	var checkFieldName = Math.round(Math.random() * 1000000);
	var _evClick = new MouseEvent('click', {
		'view' : unsafeWindow,
		'bubbles' : true,
		'cancelable' : true
	});
	_evClick[checkFieldName] = true;
	function listenToAllClicks() {
		//console.log("Assigned click listener");
		document.addEventListener("click", function(ev) {
			if( checkFieldName in ev) {
				// just checking - no need to do anything
				checkPassed = true;
			} else {
				self.port.emit("intab.click");
			}
			return;
		});
	}

	window.setInterval(function() {
		if(!checkPassed) {
			listenToAllClicks();
		}
		checkPassed = false;
		document.dispatchEvent(_evClick);
	}, 500);

})();
