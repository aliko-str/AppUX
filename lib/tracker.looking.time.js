var Tracker = require("./tracker.js").Tracker;
var tabs = require("sdk/tabs");
var urls = require("sdk/url");
var selfExt = require("sdk/self");
var MatchPattern = require("./util/match-pattern.js").MatchPattern;

var LookingTimeTracker = function(props, moduleName, trackInDetailWebs, exclude) {
	"use strict";
	var self = this;
	var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
	var console = new (require("./console.js").Console)(props.getProp("sessionId"), moduleName);
	var httpsRegex = /^https?:\/\//;
	var _checkTabUrlValid = function(url) {
		if(!url || !httpsRegex.test(url)) {
			return false;
		}
		return true;
	};
	var _checkTabUrlToBeTracked = function(url) {
		var hostname = urls.URL(url).hostname;
		return self._getOutpNameByHostname(hostname);
	};

	var trackedWebpage = {
		lastIsTop: true,
		tab : null,
		websiteIdBeingLookedAt : "",
		webpageBeingLookedAt : "",
		timestampBeingLookedFrom : Date.now(),
		createObj : function(url, tab) {
			var hostname = urls.URL(url).hostname;
			this.websiteIdBeingLookedAt = self._getOutpNameByHostname(hostname);
			this.webpageBeingLookedAt = url;
			this.timestampBeingLookedFrom = Date.now();
			this.tab = tab;
		},
		destroyObj : function() {
			this.websiteIdBeingLookedAt = "";
			this.tab = null;
			this.webpageBeingLookedAt = "";
			this.timestampBeingLookedFrom = Date.now();
			this.lastIsTop = true;
		},
		isTracked : function() {
			return this.websiteIdBeingLookedAt;
		},
		setIsTop : function(isTop){
			this.lastIsTop = isTop;
		}
	};

	// var _checkSaveRestart = function(tab, isTop) {
		// // resembles handleOnActivate: save if needed, re-create the trackedWebpageObj
		// if(trackedWebpage.isTracked()) {
			// storage.addObj(self.opts.outputToWriteInto[trackedWebpage.websiteIdBeingLookedAt], {
				// url : trackedWebpage.webpageBeingLookedAt,
				// period : (Date.now() - trackedWebpage.timestampBeingLookedFrom),
				// isTop : isTop
			// });
		// }
		// trackedWebpage.destroyObj();
		// if(_checkTabUrlValid(tab.url) && _checkTabUrlToBeTracked(tab.url)) {
			// trackedWebpage.createObj(tab.url, tab);
		// } else {
			// // simply ignore third-party websites
		// }
		// return;
	// };
	
	function _trySave(isTop){
		if(trackedWebpage.isTracked()) {
			storage.addObj(self.opts.outputToWriteInto[trackedWebpage.websiteIdBeingLookedAt], {
				url : trackedWebpage.webpageBeingLookedAt,
				period : (Date.now() - trackedWebpage.timestampBeingLookedFrom),
				isTop : isTop
			});
		}
		return;
	}
	
	function _destroyTryRestart(tab, isTop){
		trackedWebpage.destroyObj();
		if(_checkTabUrlValid(tab.url) && _checkTabUrlToBeTracked(tab.url)) {
			trackedWebpage.createObj(tab.url, tab);
			if(isTop !== undefined){
				trackedWebpage.setIsTop(isTop);
			}
		} else {
			// simply ignore third-party websites
		}
		return;
	}
	
	var handleOnReady = function(tab) {
		if(tab.id === tabs.activeTab.id){
			handleOnActivate(tab);
			// if(!trackedWebpage.isTracked()){
				// // if not tracked - consider tracking
				// _destroyTryRestart(tab);
				// if(props.debug){
					// console.log("Tried to restart tracking on the onReady event");
				// }
			// }
		}
		return;
	};

	var handleOnActivate = function(tab) {
		if(trackedWebpage.isTracked()) {
			var checkPositionWorker = trackedWebpage.tab.attach({
				contentScriptFile : selfExt.data.url("trackers/get.scrolling.position.js"),
				onError : function(err) {
					console.error("w5xim", err.toString());
					if(props.debug) {
						throw err;
					}
					return;
				}
			});
			if(checkPositionWorker){
				// if everything as planned, i.e., if the tab exists and the associated page isn't loading/unloading.
				var getPositionCallback = function(websiteIdWasLookedAt, periodWasLookedAt, webpageBeingLookedAt, checkPositionWorker) {
					return function(data) {
						storage.addObj(self.opts.outputToWriteInto[websiteIdWasLookedAt], {
							url : webpageBeingLookedAt,
							period : periodWasLookedAt,
							isTop : data.isTop
						});
						// if trackedWebpage is still the same, memorize lastIsTop
						if(trackedWebpage.webpageBeingLookedAt == webpageBeingLookedAt){
							trackedWebpage.setIsTop(data.isTop);
						}
						// clean-up: once we've got isTop, we no longer need this worker
						checkPositionWorker.destroy();
					};
				};
				checkPositionWorker.port.on("position", getPositionCallback(trackedWebpage.websiteIdBeingLookedAt, Date.now() - trackedWebpage.timestampBeingLookedFrom, trackedWebpage.webpageBeingLookedAt, checkPositionWorker));
			}else{
				if(props.debug){
					console.log("checkPositionWorker was undefined ==> used lastIsTop instead of asking");
				}
				_trySave(trackedWebpage.lastIsTop);
			}
		}
		_destroyTryRestart(tab);
	};
	var inits = {
		scriptsToLoad : ["trackers/looking.time.client.js"],
		moduleName : moduleName,
		trackerName : "looking.time.tracker",
		outputToWriteInto : null,
		include : (function(trackInDetailWebs) {
			var include = [];
			for(var i = 0, ilen = trackInDetailWebs.length; i < ilen; i++) {
				include.push("*." + trackInDetailWebs[i].webRoot);
			}
			return include;
		})(trackInDetailWebs),
		onDeactivate : function(storage, console, self) {
			tabs.removeListener("activate", handleOnActivate);
			tabs.removeListener("ready", handleOnReady);
		},
		moduleFolder : "trackers/",
		onAttach : function() {
			// no-op
		},
		contentScriptOptions : {},
		pageModOptions : {
			attachTo : ["top"]
		},
		websitesToTrack : trackInDetailWebs
	};
	inits.onAttach = function(worker, storage, console, self) {
		// same as onActivate, but without onReady reattachement
		worker.port.on("is.top.changed", function(data) {
			// "data" interface: baseUrl, url, isTop
			if(!_checkTabUrlToBeTracked(data.url)) {
				// fool check:
				throw new Error("A looking tracker worker has been attached to a url OUTSIDE of includePtrn");
			}
			// the webpageIsAlready
			if(!trackedWebpage.isTracked()) {
				throw new Error("The url of this tab is valid and should be tracked, but it's not tracked");
			}
			if(trackedWebpage.webpageBeingLookedAt.indexOf(data.baseUrl) == -1) {
				throw new Error("The webpage that fired is.top.changed isn't the one is being time-noted.");
			}
			_trySave(data.isTop);
			_destroyTryRestart(worker.tab, data.isTop);
			//_checkSaveRestart(worker.tab, data.isTop);
			return;
		});
	};
	Tracker.call(this, props, inits);
	var _oldOnActivate = this.activate;
	this.activate = function(nextActivityCallback) {

		tabs.on("activate", function(tab){
			console.log("Activated tab: " + tab.url);
			handleOnActivate(tab);
		});
		tabs.on("ready", handleOnReady);
		return _oldOnActivate.call(this, nextActivityCallback);
	};
	return this;
};

LookingTimeTracker.prototype = Object.create(Tracker);

module.exports = {
	LookingTimeTracker : LookingTimeTracker
};
