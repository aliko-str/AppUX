(function() {
	var ap = window.AppUX;
	var imgToLoad = {
		"google.logo" : "logo.png",
		"google.settings" : "settings.button.png",
		"further.pages" : "further.pages.png"
	};
	var cssToLoad = ["main.google.css"];

	function _defaultInit(ap, imgToLoad, cssToLoad) {
		for(var i = 0, _keys = Object.keys(imgToLoad), ilen = _keys.length; i < ilen; i++) {
			ap.loadImage(_keys[i], ap.baseUrl + ap.folder + "google.files/" + imgToLoad[_keys[i]], function() {
			});
		}
		for(var i = 0, ilen = cssToLoad.length; i < ilen; i++) {
			ap.loadCss(ap.baseUrl + ap.folder + cssToLoad[i]);
		}
	}

	function renderGoogleSnippets(ap, snippetRootSlt) {
		var jqRootUl = $(snippetRootSlt);
		var snippetHtml = "";
		ap.google.websites.shuffle();
		for(var i = 0, ilen = ap.google.websites.length; i < ilen; i++) {
			snippetHtml += ap.google.tmpl.interpolate(ap.google.websites[i]);
		}
		jqRootUl.html(snippetHtml);
		jqRootUl.find("a").attr("target", "_blank");
		sendDataListToAddon(ap, "data.initWebs", jqRootUl);
		return jqRootUl.size();
	}

	function positionOverlays() {
		var jqTopOverl = $("#apUXOverlayTop");
		var jqRightOverl = $("#apUXOverlayRight");
		var jqBottomOverl = $("#apUXOverlayBottom");
		var topOverlHeight = $("#slim_appbar").offset().top + $("#slim_appbar").outerHeight();
		jqTopOverl.height(topOverlHeight);
		var bottomOverlHeight = $("body").height() - $("#foot").offset().top + 10;
		jqBottomOverl.height(bottomOverlHeight);
		jqBottomOverl.css("top", ($("#foot").offset().top - 10).toString() + "px");
		var rightOverlWidth = $("body").width() - ($("#ires").offset().left + $("#ires").outerWidth());
		jqRightOverl.width(rightOverlWidth);
		jqRightOverl.height($("body").height());
	}

	function makeSnippetsDraggable(jqRoot) {
		var jqAllLi = jqRoot.find("li");
		//var dataKeyStrTop = "AppUX.top";
		var rootTopCoord = jqRoot.offset().top;
		var liTopCoordStore = [];
		jqAllLi.each(function(i, el) {
			var jqLi = $(el);
			liTopCoordStore[i] = jqLi.offset().top - rootTopCoord;
			//jqLi.data(dataKeyStrTop, liTopCoordStore[i]);
		});
		jqAllLi.each(function(i, el) {
			var jqLi = $(el);
			jqLi.css("position", "absolute");
			jqLi.css("top", liTopCoordStore[i] + "px");
			//jqLi.css("top", jqLi.data(dataKeyStrTop) + "px");
			var jqOverlay = $("<div class='AppUXDraggableDiv'></div>");
			jqOverlay.height(jqRoot.find("div.rc").height());
			jqLi.append(jqOverlay);
		});
		jqAllLi.parent().first().sortable({
			cursor : "grabbing",
			appendTo : jqRoot,
			opacity : 0.5,
			axis : "y",
			change : function(ev, ui) {
				jqRoot.find("li").not(ui.item.add(ui.helper)).each(function(i) {
					$(this).css("top", liTopCoordStore[i] + "px");
				});
			},
			stop : function(ev, ui) {
				jqRoot.find("li").not(ui.helper).each(function(i, el) {
					var jqThis = $(el);
					jqThis.css("top", liTopCoordStore[jqThis.index()] + "px");
				});
			}
		});
		jqAllLi.parent().first().disableSelection();
	}

	function duplicateSnippetsOnTheRight(ap, snippetSlt, rightOverlSlt, finBtnContainerSlt) {
		var jqRightOverl = $(rightOverlSlt);
		// duplicate overlay so the content is not transparent
		var jqRightOverlClone = jqRightOverl.clone();
		jqRightOverlClone.removeClass("apUX-overlay");
		jqRightOverlClone.addClass("appUXOverlayOverlay");
		jqRightOverlClone.offset(jqRightOverl.offset());
		jqRightOverlClone.width(jqRightOverl.width());
		jqRightOverlClone.height(jqRightOverl.height());
		jqRightOverl.after(jqRightOverlClone);
		// copy snippents on the right
		var jqSnippList = $(snippetSlt);
		var jqSnippListCopy = jqSnippList.clone();
		jqRightOverlClone.append(jqSnippListCopy);
		jqSnippListCopy.css("position", "absolute");
		jqSnippListCopy.css("top", jqSnippList.offset().top + "px");
		jqSnippListCopy.css("width", jqSnippList.width() + "px");
		// create the finish button -- container configuration
		var jqFinBtnContClone = $(finBtnContainerSlt).clone();
		jqRightOverlClone.append(jqFinBtnContClone);
		jqFinBtnContClone.css("position", "absolute");
		jqFinBtnContClone.css("top", (jqSnippList.offset().top + jqSnippList.height()).toString() + "px");
		jqFinBtnContClone.css("width", jqSnippListCopy.width() + "px");
		// configure the finish button
		var jqFinishBtn = jqFinBtnContClone.find("input[type='button']");
		jqFinishBtn.css("visibility", "visible");
		jqFinishBtn.before("<br/>");
		//jqFinishBtn.click();
		disableSubmitForNSec(jqFinishBtn, ap.options.minTimeToBrowse, "Time till you can submit:  ", function(ev) {
			onFinishGoogleExperience(ap, jqSnippListCopy, jqFinishBtn);
		}, function() {
			// no-op
		});
		// and make the snippets draggable
		makeSnippetsDraggable(jqSnippListCopy);
		return jqRightOverlClone;
	}

	function onFinishGoogleExperience(ap, jqSnippRoot, jqFinishBtn) {
		var _confirm = window.confirm("Press 'Yes' to confirm this is not an accidental click and you've indeed finished. Press 'Cancel' to go back to rearranging.'");
		var websList;
		if(_confirm) {
			websList = sendDataListToAddon(ap, "data.rearrWebs", jqSnippRoot);
			window.setTimeout(function() {
				ap.port.emit("next");
			}, 500);
			jqFinishBtn.val("Sending data...");
			jqFinishBtn.prop("disabled", true);
		}
		return websList;
	}

	function sendDataListToAddon(ap, evName, jqList) {
		var initList = [];
		jqList.find("li").each(function(i, el) {
			var jqThis = $(el);
			initList.push({
				webRoot : jqThis.attr("data-id"),
				index : jqThis.index()
			});
		});
		ap.port.emit(evName, initList);
		return initList;
	}

	// run that shit //
	_defaultInit(ap, imgToLoad, cssToLoad);
	renderGoogleSnippets(ap, "#rso div.srg");
	window.setTimeout(function() {
		positionOverlays();
		var jqSnippetContainer = duplicateSnippetsOnTheRight(ap, "#res", "#apUXOverlayRight", "#extrares");
	}, 100);
	//positionOverlays();
	// END run that shit //
})();
