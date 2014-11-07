(function() {
	"use strict";
	var ap = window.AppUX;
	var imgToLoad = {
	};
	var websitesToRate = ap.options.websitesToRate;
	if(ap.options.debug) {
		//fool check
		if(!websitesToRate instanceof Array) {
			throw new Error("#f0fm7 websitesToRate wasn't an array");
		}
		if(!websitesToRate.length) {
			throw new Error("this module makes no sense without websites to rate -- the input array of websites is empty");
		}
		if(!ap.options.question) {
			throw new Error("there shall be a question to ask!");
		}
		if(!ap.options.apUXWebsMinLabel || !ap.options.apUXWebsMaxLabel) {
			throw new Error("max and min labels are missing for a question");
		}
	}
	var cssToLoad = ["side.libs/bootstrap.min.css", "module.website.ratings/main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}

	(function setUpVisuals(websList) {
		var timestampFrom;
		var timestampTo;
		var timestampOnLoad;
		var dataArr = [];
		$("#apUXWebsQuestion").text(ap.options.question);
		$("#apUXWebsMinLabel").text(ap.options.apUXWebsMinLabel);
		$("#apUXWebsMaxLabel").text(ap.options.apUXWebsMaxLabel);
		timestampFrom = setWebsiteToRate(websList.shift(), function() {
			timestampOnLoad = Date.now();
		});
		$("form").submit(function(ev) {
			var jqForm = $(this);
			jqForm.find("input[type='button']").val("Saving it...").prop("disabled", true);
			var data = {
				webRoot : jqForm.find("input[name='webRoot']").val(),
				fullTime : timestampTo - timestampFrom,
				onLoadTime : timestampTo - timestampOnLoad,
				score : jqForm.find("input[name='apUXWebsRating']:checked").val()
			};
			dataArr.push(data);
			window.setTimeout(function() {
				if(websList.length) {
					timestampFrom = setWebsiteToRate(websList.shift(), function() {
						timestampOnLoad = Date.now();
					});
				} else {
					saveWebsiteRatingsTimeToRate(dataArr);
				}
				return;
			}, 500);
			ev.preventDefault();
		});
		$("input[type='radio']").click(function(ev) {
			timestampTo = Date.now();
		});
	})(websitesToRate.shuffle());

	function saveWebsiteRatingsTimeToRate(dataArr) {
		ap.port.emit("data", dataArr);
		ap.port.emit("next", "let's roll!");
		return dataArr.length;
	}

	function setWebsiteToRate(website, onLoadCallback) {
		var jqForm = $("form");
		jqForm.trigger("reset");
		jqForm.find("input[type='button']").val("Rate the website").prop("disabled", false);
		jqForm.find("input[name='webRoot']").val(website.hostname);
		// $("#apUXWebsHostname").val(website.hostname);
		$("#apUXWebsPreviewRoot").attr("src", website.url).load(onLoadCallback);
		//$("input[type='radio']").prop("checked", false);
		$('html, body').animate({
			scrollTop : 0
		}, 700);
		return Date.now();
	};
})();
