var Tracker = require("./tracker.js").Tracker;
var urls = require("sdk/url");

function constructOutpObj(webRootArr) {
	"use strict";
	var nameIndex = {
	};
	var nameIndexIndex = {
	};
	const CLICKSTR = "intab.clicks";
	var tmpKeyStr1;
	// regular, allowed webroots
	for(var i = 0, ilen = webRootArr.length; i < ilen; i++) {
		tmpKeyStr1= webRootArr[i].webRoot + "." + CLICKSTR;
		nameIndex[tmpKeyStr1] = "." + tmpKeyStr1;
		nameIndexIndex[webRootArr[i].webRoot] = tmpKeyStr1;
	}

	function getClickOutNameFunc(nameIndexVisit) {
		return function(webRoot) {
			if(!( typeof webRoot == "string")) {
				throw new Error("webRoot shall be a string");
			}
			for(var i = 0, _keys = Object.keys(nameIndexVisit), ilen = _keys.length; i < ilen; i++) {
				if(webRoot.indexOf(_keys[i]) != -1) {
					return nameIndexVisit[_keys[i]];
				}
			}
			return "";
		};
	}
	return {
		nameIndex : nameIndex,
		getClickName : getClickOutNameFunc(nameIndexIndex)
	};
}

var ClickTracker = function(props, includePtrn, trackInDetailWebs) {
	var outNameManager = constructOutpObj(trackInDetailWebs);
	var inits = {
		scriptsToLoad : ["trackers/clicks.client.js"],
		moduleName : "clicks.tracker",
		outputToWriteInto : null,
		include : includePtrn,
		onDeactivate : function(storage, console, self) {
		},
		moduleFolder : "trackers/",
		onAttach : function() {
			// no-op
		},
		contentScriptOptions : {},
		pageModOptions : {
			attachTo : ["top", "frame"]
		}
	};
	inits.outputToWriteInto = outNameManager.nameIndex;
	inits.onAttach = function(worker, storage, console, self){
			worker.port.on("intab.click", function() {
				if(worker.tab.url){
					var hostname = urls.URL(worker.tab.url).hostname;
					// check if in the list of accepted webRoots
					var outClickName = outNameManager.getClickName(hostname);
					if(outClickName){
						storage.addObj(self.opts.outputToWriteInto[outClickName], "click");
					}else{
						return console.log("CLICK on a third-party page occured");
					}
				}else{
					return console.log("CLICK in an empty-url tab occured.");
				}
				return;
			});
	};
	Tracker.call(this, props, inits);
	return this;
};

ClickTracker.prototype = Object.create(Tracker);

module.exports = {
	ClickTracker : ClickTracker
};
