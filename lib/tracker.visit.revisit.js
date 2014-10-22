var Tracker = require("./tracker.js").Tracker;

function constructOutpObj(webRootArr) {
	"use strict";
	var nameIndex = {
	};
	var nameIndexIndex = {
		visit : {},
		refer : {}
	};
	var VISITSTR = "history.visit";
	var REFERSTR = "history.referredto";
	var tmpKeyStr1, tmpKeyStr2;
	// regular, allowed webroots
	for(var i = 0, ilen = webRootArr.length; i < ilen; i++) {
		tmpKeyStr1 = webRootArr[i].webRoot + "." + VISITSTR;
		tmpKeyStr2 = webRootArr[i].webRoot + "." + REFERSTR;
		nameIndex[tmpKeyStr1] = "." + tmpKeyStr1;
		nameIndex[tmpKeyStr2] = "." + tmpKeyStr2;
		nameIndexIndex.visit[webRootArr[i].webRoot] = tmpKeyStr1;
		nameIndexIndex.refer[webRootArr[i].webRoot] = tmpKeyStr2;
	}
	// special cases of webroots
	tmpKeyStr2 = "third.party" + "." + REFERSTR;
	nameIndex[tmpKeyStr2] = "." + tmpKeyStr2;
	nameIndexIndex.refer["third.party"] = tmpKeyStr2;
	tmpKeyStr2 = "empty" + "." + REFERSTR;
	nameIndex[tmpKeyStr2] = "." + tmpKeyStr2;
	nameIndexIndex.refer["empty"] = tmpKeyStr2;

	function getHistoryOutNameFunc(nameIndexVisit) {
		return function(webRoot) {
			if(!webRoot || !( typeof webRoot == "string")) {
				throw new Error("webRoot can't be empty and shall be a string");
			}
			for(var i = 0, _keys = Object.keys(nameIndexVisit), ilen = _keys.length; i < ilen; i++) {
				if(webRoot.indexOf(_keys[i]) != -1) {
					return nameIndexVisit[_keys[i]];
				}
			}
			return "";
		};
	}

	function getReferOutNameFunc(nameIndexRefer) {
		return function(webRoot) {
			if(!( typeof webRoot == "string")) {
				throw new Error("webRoot shall be a string");
			}
			if(!webRoot) {
				return nameIndexRefer["empty"];
			}
			for(var i = 0, _keys = Object.keys(nameIndexRefer), ilen = _keys.length; i < ilen; i++) {
				if(webRoot.indexOf(_keys[i]) != -1) {
					return nameIndexRefer[_keys[i]];
				}
			}
			return nameIndexRefer["third.party"];
		};
	}

	return {
		nameIndex : nameIndex,
		getVisitName : getHistoryOutNameFunc(nameIndexIndex.visit),
		getReferName : getReferOutNameFunc(nameIndexIndex.refer)
	};
}

var BrowsingTracker = function(props, includePtrn, trackInDetailWebs) {
	var outNameManager = constructOutpObj(webRootArr);
	var inits = {
		scriptsToLoad : ["trackers/visit.revisit.client.js"],
		moduleName : "back.button.tracker",
		outputToWriteInto : null,
		include : includePtrn,
		onDeactivate : function(storage, console, self) {
			for(var i = 0, _keys = Object.keys(revisitationUrlStore), ilen = _keys.length; i < ilen; i++) {
				storage.addObj(self.opts.outputToWriteInto["history.revisit"], {
					key : _keys[i],
					val : revisitationUrlStore[_keys[i]]
				});
			}
		},
		moduleFolder : "trackers/",
		onAttach : function() {
			// no-op
		},
		contentScriptOptions : {},
		pageModOptions : {
			attachTo : ["top"]
		}
	};
	inits.outputToWriteInto = outNameManager.nameIndex;
	inits.onAttach = function(worker, storage, console, self){
			worker.port.on("history.visit", function(data) {
				// "data" interface: baseUrl, url, revisit, referrer, referrerBaseUrl
				// check if in the list of accepted webRoots
				// if not, check referrer
				var outVisitName = outNameManager.getVisitName(data.webRoot);
				if(outVisitName){
					storage.addObj(self.inits.outputToWriteInto[outVisitName], {url: data.url, revisit: data.revisit});
				}else{
					var outReferName = outNameManager.getReferName(data.referrerBaseUrl);
					storage.addObj(self.inits.outputToWriteInto[outReferName], data.url);
				}
				return;
			});
	};
	Tracker.call(this, props, inits);
	return this;
};

BrowsingTracker.prototype = Object.create(Tracker);

module.exports = {
	BrowsingTracker : BrowsingTracker
};
