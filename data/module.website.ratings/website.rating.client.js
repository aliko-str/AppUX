(function() {
	var ap = window.AppUX;
	var imgToLoad = {
	};
	var websitesToRate = ap.options.websitesToRate;
	if(ap.options.debug){
		//fool check
		if(!websitesToRate instanceof Array){
			throw new Error("#f0fm7 websitesToRate wasn't an array");
		}
		if(!ap.options.question){
			throw new Error("there shall be a question to ask!");
		}
		if(!ap.options.apUXWebsMinLabel || !ap.options.apUXWebsMaxLabel){
			throw new Error("max and min labels are missing for a question");
		}
	}
	websitesToRate = websitesToRate.shuffle();
	var cssToLoad = ["side.libs/bootstrap.min.css", "module.website.ratings/main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++){
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function(){});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++){
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}
	
	// window.document.getElementById("finishReading").onclick = function(ev){
		// ap.port.emit("next", "let's roll!");
	// };
	$("#apUXWebsQuestion").text(ap.options.question);
	$("#apUXWebsMinLabel").text(ap.options.apUXWebsMinLabel);
	$("#apUXWebsMaxLabel").text(ap.options.apUXWebsMaxLabel);
	$("form").submit(function(ev){
		$(this).find("input[type='button']").val("Saving it...").prop("disabled", true);
		window.setTimeout(function(){
			setWebsiteToRate(websitesToRate.shift());
			return;
		}, 500);
		ev.preventDefault();
	});

	function setWebsiteToRate(website){
		if(website){
			$("input[type='button']").val("Rate the website").prop("disabled", false);
			$("#apUXWebsHostname").val(website.hostname);
			$("#apUXWebsPreviewRoot").attr("srt", website.url);
		}else{
			var dataRaw = $(this).serializeArray();
			var data = {};
			$.each(dataRaw, function(i, field) {
				data[field.name] = field.value;
			});
			ap.port.emit("data", data);
			setTimeout(function(){
				ap.port.emit("next", "let's roll!");
			}, 500);
		}
		return (website && true);
	};
})();
