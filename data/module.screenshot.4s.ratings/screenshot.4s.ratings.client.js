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
		var timestampFrom, timeIntervalsTop, timeIntervalsAfterScroll, dataArr, isTop;
		isTop = true;
		dataArr = [];
		timeIntervalsTop = [];
		timeIntervalsAfterScroll = [];
		$("#apUXWebsQuestion").text(ap.options.question);
		$("#apUXWebsMinLabel").text(ap.options.apUXWebsMinLabel);
		$("#apUXWebsMaxLabel").text(ap.options.apUXWebsMaxLabel);
		window.addEventListener("is.top.changed", function(ev){
			if(isTop){
				timeIntervalsTop.push(Date.now() - timestampFrom);
			}else{
				timeIntervalsAfterScroll.push(Date.now()- timestampFrom);
			}
			timestampFrom = Date.now();
			isTop = ev.detail.isTop;
		});
		setScreenshotToRate(ap, screenList.shift(), function() {
			timestampFrom = Date.now();
		});
		$("form").submit(function(ev) {
			var jqForm = $(this);
			jqForm.find("input[type='button']").val("Saving it...").prop("disabled", true);
			var data = {
				fname : jqForm.find("input[name='fname']").val(),
				timeTop : timeIntervalsTop.reduce(function(a,b){
					return a + b;
				}),
				timeBelowTop : timeIntervalsAfterScroll.reduce(function(a, b){
					return a + b;
				}),
				score : jqForm.find("input[name='apUXWebsRating']:checked").val()
			};
			dataArr.push(data);
			window.setTimeout(function() {
				if(screenList.length) {
					setScreenshotToRate(ap, screenList.shift(), function() {
						isTop = true;
						timeIntervalsTop = [];
						timeIntervalsAfterScroll = [];
						timestampFrom = Date.now();
					});
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

	function setScreenshotToRate(ap, screenshot, unfreezeCallback) {
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

	function onScrollHandler() {
		_isTopNow = isTopScreen(window.innerHeight, window.pageYOffset);
		if(_isTopNow != _isTopThen) {
			var event = new CustomEvent('is.top.changed', {
				detail : {
					isTop : isTopScreen(window.innerHeight, window.pageYOffset)
				}
			});
			window.dispatchEvent(event);
		}
		_isTopThen = _isTopNow;
	}

})();

