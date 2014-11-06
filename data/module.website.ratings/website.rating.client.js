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
	websitesToRate = websitesToRate.shuffle();
	var cssToLoad = ["side.libs/bootstrap.min.css", "module.website.ratings/main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}

	$("#apUXWebsQuestion").text(ap.options.question);
	$("#apUXWebsMinLabel").text(ap.options.apUXWebsMinLabel);
	$("#apUXWebsMaxLabel").text(ap.options.apUXWebsMaxLabel);
	setWebsiteToRate(websitesToRate.shift());
	var ratingArr = [];
	$("form").submit(function(ev) {
		$(this).find("input[type='button']").val("Saving it...").prop("disabled", true);
		var data = {};
		$(this).serializeArray().forEach(function(el, i) {
			data[el.name] = el.value;
		});
		ratingArr.push(data);
		window.setTimeout(function() {
			if(websitesToRate.length) {
				setWebsiteToRate(websitesToRate.shift());
			} else {
				saveWebsiteRatings(ratingArr);
			}
			return;
		}, 500);
		ev.preventDefault();
	});

	function saveWebsiteRatings(ratingArr) {
		ap.port.emit("data", ratingArr);
		ap.port.emit("next", "let's roll!");
		return ratingArr.length;
	}

	function setWebsiteToRate(website) {
		$("form").trigger("reset");
		$("input[type='button']").val("Rate the website").prop("disabled", false);
		$("#apUXWebsHostname").val(website.hostname);
		$("#apUXWebsPreviewRoot").attr("src", website.url);
		//$("input[type='radio']").prop("checked", false);
    $('html, body').animate({
        scrollTop: 0
    }, 1000);
		return true;
	};
})();
