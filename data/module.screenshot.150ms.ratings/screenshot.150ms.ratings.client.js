(function() {
	"use strict";
	var ap = window.AppUX;
	var imgToLoad = {
		"fixationCrossImg" : ap.folder + "2.png",
		"blackWhiteNoise" : ap.folder + "noise.png"
	};
	const sreenshotExposureDuration = ap.options.time;
	var screenshotsToRate = ap.options.screenshotsToRate;
	var testScreenshots = ap.options.testScreenshots || [];
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
	screenshotsToRate = screenshotsToRate.shuffle();
	testScreenshots = testScreenshots.shuffle();
	for(var i = testScreenshots.length; i--; ){
		screenshotsToRate.unshift(testScreenshots[i]);
	}
	var cssToLoad = ["side.libs/bootstrap.min.css", ap.folder + "main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	
	const showWhichPart = (function() {
		const jqFixCross = $("#fixationCrossBox");
		const jqRateControls = $("#rateControlsContainer");
		const jqScreensh = $("#rateeContainer");
		const jqNoise = $("#blackWhiteNoise");
		return function(partName) {
			switch(partName) {
				case "screenshot":
					jqFixCross.hide();
					jqRateControls.css("display", "none");
					jqNoise.hide();
					jqScreensh.show();
					break;
				case "cross":
					jqRateControls.css("display", "none");
					jqNoise.hide();
					jqScreensh.hide();
					jqFixCross.show();
					break;
				case "rate.controls":
					jqScreensh.hide();
					jqFixCross.hide();
					jqNoise.hide();
					jqRateControls.css("display", "flex");
					break;
				case "noise":
					jqRateControls.css("display", "none");
					jqScreensh.hide();
					jqFixCross.hide();
					jqNoise.show();
			}
		};
	})();
	
	(function setUpVisuals(screenList) {
		var timestampFrom, timestampTo, _realExposureDuration, dataArr, jqForm;
		function noteTimestampCallback(_realExpDur){
			_realExposureDuration = _realExpDur;
			timestampFrom = Date.now();
		}
		dataArr = [];
		jqForm = $("form");
		$("#apUXWebsQuestion").html(ap.options.question);
		$("#apUXWebsMinLabel").text(ap.options.apUXWebsMinLabel);
		$("#apUXWebsMaxLabel").text(ap.options.apUXWebsMaxLabel);
		jqForm.find("input[type='radio']").change(function(){
			timestampTo = Date.now();
		});
		jqForm.submit(function(ev) {
			// $("#fixationCrossBox").addClass("displayFlex").parent().addClass('full-height');
			dataArr.push({
				fname : jqForm.find("input[name='fname']").val(),
				timeToRate : timestampTo - timestampFrom,
				score : jqForm.find("input[name='apUXWebsRating']:checked").val(),
				realExposure: _realExposureDuration
			});
			if(screenList.length) {
				runOneTrial(ap, screenList.shift(), noteTimestampCallback);
			} else {
				saveScreenshotRatingsTimeToRate(dataArr);
			}
			ev.preventDefault();
		});
		return runOneTrial(ap, screenList.shift(), noteTimestampCallback);
	})(screenshotsToRate);
	
	function runOneTrial(ap, screenshot, startTimeCountingCallback){
		var _realExposureDuration;
		var crossTime = 1000 + Math.round(500 * Math.random());
		var jqForm = $("form");
		jqForm.trigger("reset");
		showWhichPart("cross");
		window.setTimeout(function(){
			setScreenshotToRate(ap, jqForm, screenshot, function(){
				_realExposureDuration = Date.now();
				window.setTimeout(function(){
					showWhichPart("noise");
					window.setTimeout(function(){
						showWhichPart("rate.controls");
						startTimeCountingCallback(Date.now()-_realExposureDuration);
					}, 50);
				}, sreenshotExposureDuration);
			});
		}, crossTime);
		return crossTime;
	}

	function saveScreenshotRatingsTimeToRate(dataArr) {
		ap.port.emit("data", dataArr);
		ap.port.emit("next", "let's roll!");
		return dataArr.length;
	}

	function setScreenshotToRate(ap, jqForm, screenshot, onScreenshotLoad) {
		ap.loadImage("apUXScreenshotRoot", screenshot.url, function() {
			showWhichPart("screenshot");
			onScreenshotLoad();
		});
		jqForm.find("input[name='fname']").val(screenshot.fname);
		return;
	};
})();