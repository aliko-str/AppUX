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
		if(!ap.options.otherQuestions || !ap.options.otherQuestions.length) {
			throw new Error("there shall be a question to ask!");
		}
	}
	var cssToLoad = ["side.libs/bootstrap.min.css", ap.folder + "main.css"];
	for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
		ap.loadImage(_keys[i], ap.baseUrl + imgToLoad[_keys[i]], function() {
		});
	}
	for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
		ap.loadCss(ap.baseUrl + cssToLoad[i]);
	}

	var questionList = (function buildAListOfQuestions(firstQuestion, otherQuestions) {
		otherQuestions = otherQuestions.shuffle();
		otherQuestions.unshift(firstQuestion);
		return otherQuestions;
	})(ap.options.firstQuestion, ap.options.otherQuestions);

	(function populateDomQuestionList(questionList) {
		var jqRatingForm = $("form#websRatingForm");
		var jqQuestionRow = jqRatingForm.find(".wholeRatingArea");
		var jqAllQuestionsArr = [jqQuestionRow];
		// duplicate ratingAreas for each question
		for(var i = questionList.length - 1; i--; ) {
			var _clone = jqQuestionRow.clone();
			jqQuestionRow.after(_clone);
			jqAllQuestionsArr.push(_clone);
		}
		// insert texts/content into each ratingArea
		for(var i = 0, ilen = questionList.length; i < ilen; i++) {
			var jqRow = jqAllQuestionsArr[i];
			jqRow.find(".questionBox").text(questionList[i].question);
			jqRow.find("input[type='radio']").attr("name", questionList[i].id);
			jqRow.find(".apUXWebsMinLabel").text(questionList[i].apUXWebsMinLabel);
			jqRow.find(".apUXWebsMaxLabel").text(questionList[i].apUXWebsMaxLabel);
		}
	})(questionList);

	(function main(websList) {
		var jqAnswForm = $("#websAnswForm");
		var jqRatingForm = $("#websRatingForm");
		var websIndex = resetWebsite(websList, -1);
		jqAnswForm.find("#taskDescr").text(ap.options.task.text);
		jqAnswForm.find("input[name='cantAnswer']").click(function(ev){
			if(this.checked){
				jqAnswForm.find("input[name='taskAnswer']").prop("disabled", true);
			}else{
				jqAnswForm.find("input[name='taskAnswer']").prop("disabled", false);
			}
		});
		jqAnswForm.submit(function(ev) {
			ev.preventDefault();
			var hostname = $(this).find("input[name='hostname']").val();
			ap.port.emit("endTask", {
				hostname : hostname
			});
			ap.port.emit("data.task.answer", {
				webRoot : hostname,
				answer : $(this).find("input[name='taskAnswer']").val(),
				cantAnswer : $(this).find("input[name='cantAnswer']").is(":checked")
			});
			var jqThisSubmit = $(this).find("input[type='submit']");
			window.setTimeout((function(submText) {
				return function() {
					showRatingForm();
					jqThisSubmit.val(submText);
				};
			})(jqThisSubmit.val()), 500);
			jqThisSubmit.val("Saving it...");
			return;
		});
		jqRatingForm.submit(function(ev){
			ev.preventDefault();
			var dataRaw = $(this).serializeArray();
			var data = {};
			$.each(dataRaw, function(i, field) {
				data[field.name] = field.value;
			});
			ap.port.emit("data.rating", data);
			var jqThisSubmit = $(this).find("input[type='submit']");
			window.setTimeout((function(submText) {
				return function() {
					websIndex = resetWebsite(websList, websIndex);
					jqThisSubmit.val(submText);
				};
			})(jqThisSubmit.val()), 500);
			jqThisSubmit.val("Saving it...");
		});
		return;
	})(websitesToRate.shuffle());

	function showRatingForm() {
		$("#websRatingForm").show();
		$("#websAnswForm").hide();
		return;
	}

	function resetWebsite(websList, oldIndex) {
		var i = oldIndex + 1;
		var website = websList[i];
		if(!website) {
			return ap.port.emit("next", "let's roll!");
		}
		$("input[name='hostname']").val(website.hostname);
		//$("#subtleMessageBox").hide();
		$("#websRatingForm").hide().trigger('reset');
		$("#websAnswForm").show().trigger('reset').find("input").prop("disabled", false);
		$("#websNum").text(i + 1);
		$("#websNumAll").text(websList.length);
		$("#websUrl").attr("href", website.url).text(website.url);
		$("#websUrl").one("click", function(ev) {
			ap.port.emit("startTask", {
				hostname : website.hostname
			});
		});
		// if(i){
			// // all but first
			// $("#subtleMessageBox").slideDown(600).find("#pastWebsName").text(websList[i-1].hostname);
		// }
		return i;
	}
})();
