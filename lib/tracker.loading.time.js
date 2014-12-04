var {Cc, Ci} = require("chrome");
var tabs = require("sdk/tabs");
var timer = require('sdk/timers');
var urls = require("sdk/url");
const trackerName = "loading.time.tracker";
var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
var browserEnumerator = wm.getEnumerator("navigator:browser");
var gBrowser = browserEnumerator.getNext().gBrowser;

var LoadTimeTracker = function(props, moduleName, trackInDetailWebs) {
	// set in-storage saving infrastracture
	var outpManager = constructOutpObj(moduleName, trackerName, trackInDetailWebs);
	this.outputToWriteInto = outpManager.nameIndex;
	var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
	var console = new (require("./console.js").Console)(props.getProp("sessionId"), moduleName);
	for(var i = 0, _keys = Object.keys(this.outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
		storage.registerOutput(this.outputToWriteInto[_keys[i]]);
	}
	function _getOutpNameByHostname(hostname, getterName) {
		getterName = getterName || "_default";
		return outpManager.getters[getterName](hostname);
	};
	var loadTimeGBrowserProgressListener = {
		onStateChange : function(aBrowser, aWebProgress, aRequest, aStateFlags) {
			console.log(aStateFlags);
		}
	};
	// // listen to all, report only those in question
	// var hostname = urls.URL(worker.tab.url).hostname;
	// // check if in the list of accepted webRoots
	// var outClickName = self._getOutpNameByHostname(hostname);
	// if(outClickName) {
		// storage.addObj(self.opts.outputToWriteInto[outClickName], "click");
	// } else {
		// return console.log("CLICK on a third-party page occured");
	// }
	this.activate = function() {
		gBrowser.addTabsProgressListener(loadTimeGBrowserProgressListener);
	};
	this.deactivate = function() {
		gBrowser.removeTabsProgressListener(loadTimeGBrowserProgressListener);
	};
	return this;
};

module.exports = {
	LoadTimeTracker : LoadTimeTracker
};

function constructOutpObj(moduleName, trackerName, webRootArr) {
	"use strict";
	if(!webRootArr instanceof Array) {
		throw new Error("The default constructor of tracker output manager requires an array of allowed websites as an input");
	}
	var nameIndex = {
	};
	var nameIndexIndex = {
	};
	const OUTPUT = "output";
	var tmpKeyStr1;
	// regular, allowed webroots
	for(var i = 0, ilen = webRootArr.length; i < ilen; i++) {
		tmpKeyStr1 = "[" + webRootArr[i].webRoot + "]." + OUTPUT;
		nameIndex[tmpKeyStr1] = trackerName + "." + moduleName + "." + tmpKeyStr1;
		nameIndexIndex[webRootArr[i].webRoot] = tmpKeyStr1;
	}

	var _outpObj = {
		nameIndex : nameIndex,
		nameIndexIndex : nameIndexIndex,
		getters : {
			"_default" : function(webRoot) {
				if(!webRoot || !( typeof webRoot == "string")) {
					throw new Error("webRoot can't be empty and shall be a string");
				}
				for(var i = 0, _keys = Object.keys(_outpObj.nameIndexIndex), ilen = _keys.length; i < ilen; i++) {
					if(webRoot.indexOf(_keys[i]) != -1) {
						return _outpObj.nameIndexIndex[_keys[i]];
					}
				}
				return "";
			}
		}
	};
	return _outpObj;
}
