(function() {
	"use strict";
	var ap = window.AppUX;
	var imgToLoad = {
	};
	var screenshotsToRate = ap.options.screenshotsToRate;
	if(ap.options.debug) {
		//fool check
		if(!screenshotsToRate instanceof Array) {
			throw new Error("#f0fm7 screenshotsToRate wasn't an array");
		}
		if(!screenshotsToRate.length) {
			throw new Error("this module makes no sense without screenshots to rate -- the input array of screenshots is empty");
		}
		if(!ap.options.question) {
			throw new Error("there shall be a question to ask!");
		}
		if(!ap.options.apUXWebsMinLabel || !ap.options.apUXWebsMaxLabel) {
			throw new Error("max and min labels are missing for a question");
		}
	}
	var cssToLoad = ["side.libs/bootstrap.min.css", "module.screenshot.4s.ratings/main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}

	(function setUpVisuals(screenList) {
		var timestampFrom, timeIntervalsTop, timeIntervalsAfterScroll, dataArr, isTop, timeTakingAllowed;
		function _noTimeTaking(){
			timeTakingAllowed = false;
		}
		function _saveTime() {
			if(timeTakingAllowed){
				if(isTop) {
					timeIntervalsTop.push(Date.now() - timestampFrom);
				} else {
					timeIntervalsAfterScroll.push(Date.now() - timestampFrom);
				}
				timestampFrom = Date.now();
			}
		}

		function _resetTime() {
			timeTakingAllowed = true;
			isTop = true;
			timeIntervalsTop = [];
			timeIntervalsAfterScroll = [];
			timestampFrom = Date.now();
		}

		dataArr = [];
		$("#apUXWebsQuestion").text(ap.options.question);
		$("#apUXWebsMinLabel").text(ap.options.apUXWebsMinLabel);
		$("#apUXWebsMaxLabel").text(ap.options.apUXWebsMaxLabel);
		setScreenshotToRate(ap, screenList.shift(), _resetTime);
		window.addEventListener("is.top.changed", function(ev) {
			_saveTime();
			isTop = ev.detail.isTop;
		});
		$("form").submit(function(ev) {
			_saveTime();
			_noTimeTaking();
			var jqForm = $(this);
			jqForm.find("input[type='button']").val("Saving it...").prop("disabled", true);
			var data = {
				fname : jqForm.find("input[name='fname']").val(),
				timeTop : timeIntervalsTop.reduce(function(a, b) {
					return a + b;
				}, 0),
				timeBelowTop : timeIntervalsAfterScroll.reduce(function(a, b) {
					return a + b;
				}, 0),
				score : jqForm.find("input[name='apUXWebsRating']:checked").val()
			};
			dataArr.push(data);
			window.setTimeout(function() {
				if(screenList.length) {
					setScreenshotToRate(ap, screenList.shift(), _resetTime);
				} else {
					saveScreenshotRatingsTimeToRate(dataArr);
				}
				return;
			}, 500);
			ev.preventDefault();
		});
		// $("input[type='radio']").click(function(ev) {
		// timestampTo = Date.now();
		// });
	})(screenshotsToRate.shuffle());

	// function sumUpTimeslotArr(timeArr, timestampFrom) {
		// if(timeArr.length) {
			// if(timeArr.length > 1) {
				// return timeArr.reduce(function(a, b) {
					// return a + b;
				// });
			// } else {
				// return Date.now() - timestampFrom + timeArr[0];
			// }
		// } else {
			// return Date.now() - timestampFrom;
		// }
	// }

	function saveScreenshotRatingsTimeToRate(dataArr) {
		ap.port.emit("data", dataArr);
		ap.port.emit("next", "let's roll!");
		return dataArr.length;
	}

	function disableSubmitForNSec(jqSubmit, sec, clickCallback, unfreezeCallback) {
		var delaySec = sec || 5;
		var strVal = "Unfreezes in ";
		var oldStrVal = jqSubmit.val();
		jqSubmit.attr("title", "You can't submit answers before the button unfreezes. This is a part of our anti-bot policy.");
		jqSubmit.attr("style", "box-shadow: none;cursor: not-allowed;opacity: 0.5;");
		jqSubmit.tooltip();
		jqSubmit.hover(function(ev) {
			ev.preventDefault();
		}, function(ev) {
			ev.preventDefault();
		});
		jqSubmit.click(function(ev) {
			ev.preventDefault();
		});
		function tick(secondLeft) {
			if(secondLeft) {
				jqSubmit.val(strVal + secondLeft.toString());
				window.setTimeout(function() {
					tick(secondLeft - 1);
				}, 1000);
			} else {
				jqSubmit.val(oldStrVal);
				jqSubmit.removeAttr("style");
				jqSubmit.off("click");
				jqSubmit.off("hover");
				if(clickCallback) {
					jqSubmit.click(clickCallback);
				}
				jqSubmit.removeAttr("title");
				jqSubmit.removeAttr("data-original-title");
				jqSubmit.tooltip({
					disabled : true
				});
				unfreezeCallback();
			}
		};
		tick(delaySec);
	};

	function setScreenshotToRate(ap, screenshot, onScreenshotLoad, unfreezeCallback) {
		unfreezeCallback = unfreezeCallback || function(){};
		var jqForm = $("form");
		jqForm.trigger("reset");
		jqForm.find("input[name='fname']").val(screenshot.fname);
		ap.loadImage("apUXScreenshotRoot", screenshot.url, function() {
			var jqSbm = jqForm.find("input[type='submit']").val("Rate the webpage");
			jqSbm.prop("disabled", false);
			disableSubmitForNSec(jqSbm, 4, function() {
				//no-op
			}, unfreezeCallback);
		});
		var tmpIm = new Image();
		tmpIm.onload = function() {
			$("#apUXScreenshotRoot").height(tmpIm.height);
			onScreenshotLoad();
		};
		tmpIm.src = screenshot.url;
		$('html, body').animate({
			scrollTop : 0
		}, 0);
		return;
	};
})();

(function() {
	"use strict";
	var windowHeight = window.innerHeight - $(".rateControlsContainer").height();
	function isTopScreen(scrollPosition) {
		return (scrollPosition < windowHeight / 2);
	}

	var _isTopThen = isTopScreen(window.pageYOffset);
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

	function onScrollHandler() {
		_isTopNow = isTopScreen(window.pageYOffset);
		if(_isTopNow != _isTopThen) {
			var event = document.createEvent('CustomEvent');
			event.initCustomEvent('is.top.changed', true, true, {
				isTop : isTopScreen(window.pageYOffset)
			});
			window.dispatchEvent(event);
		}
		_isTopThen = _isTopNow;
	}

})();

