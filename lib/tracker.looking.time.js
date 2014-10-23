var Tracker = require("./tracker.js").Tracker;
var tabs = require("sdk/tab");
var urls = require("sdk/url");
var selfExt = require("sdk/self");

var LookingTimeTracker = function(props, trackInDetailWebs) {
	"use strict";
	var self = this;
	var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
	var console = new (require("./console.js").Console)(props.getProp("sessionId"), this.opts.moduleName);
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
		websiteIdBeingLookedAt : "",
		webpageBeingLookedAt : "",
		timestampBeingLookedFrom : Date.now(),
		createObj : function(url) {
			var hostname = urls.URL(url).hostname;
			this.websiteIdBeingLookedAt = self._getOutpNameByHostname(hostname);
			this.webpageBeingLookedAt = url;
			this.timestampBeingLookedFrom = Date.now();
		},
		destroyObj : function() {
			this.websiteIdBeingLookedAt = "";
		},
		isTracked : function() {
			return this.websiteIdBeingLookedAt;
		}
	};

	var _checkSaveRestart = function(tab, isTop) {
		var __isSaved, __isRestarted;
		// resembles handleOnActivate: save if needed, re-create the trackedWebpageObj
		if(trackedWebpage.isTracked()) {
			storage.addObj(self.opts.outputToWriteInto[trackedWebpage.websiteIdBeingLookedAt], {
				url : trackedWebpage.webpageBeingLookedAt,
				period : (Date.now() - trackedWebpage.timestampBeingLookedFrom),
				isTop : isTop
			});
			__isSaved = true;
		}
		trackedWebpage.destroyObj();
		if(_checkTabUrlValid(tab.url) && _checkTabUrlToBeTracked(tab.url)) {
			trackedWebpage.createObj(tab.url);
			__isRestarted = true;
		} else {
			// simply ignore third-party websites
		}
		return {
			__isSaved : __isSaved,
			__isRestarted : __isRestarted
		};
	};
	var handleOnReady = function(tab) {
		_checkSaveRestart(tab, true);
		return;
	};

	var handleOnActivate = function(tab) {
		console.log("Activated tab:", tab.url);
		if(trackedWebpage.isTracked()) {
			var checkPositionWorker = tab.attach({
				contentScript : selfExt.data.url("./trackers/get.scrolling.position.js"),
				onError : function(err) {
					return console.error("w5xim", err.toString());
				}
			});
			checkPositionWorker.port.on("position", getPositionCallback);
			//checkPositionWorker.port.emit("get.position");
			// call tab.worker.getScrollingPosition, pass this callback:
			var getPositionCallback = (function(websiteIdWasLookedAt, periodWasLookedAt, webpageBeingLookedAt, checkPositionWorker) {
				return function(data) {
					storage.addObj(self.opts.outputToWriteInto[websiteIdWasLookedAt], {
						url : webpageBeingLookedAt,
						period : periodWasLookedAt,
						isTop : data.isTop
					});
					// clean-up: once we've got isTop, we no longer need this worker
					checkPositionWorker.destroy();
				};
			})(trackedWebpage.websiteIdBeingLookedAt, Date.now() - trackedWebpage.timestampBeingLookedFrom, trackedWebpage.webpageBeingLookedAt, checkPositionWorker);
		}
		trackedWebpage.destroyObj();
		if(_checkTabUrlValid(tab.url) && _checkTabUrlToBeTracked(tab.url)) {
			trackedWebpage.createObj(tab.url);
		} else {
			// simply ignore third-party websites
		}
	};
	tabs.on("activate", handleOnActivate);
	tabs.on("ready", handleOnReady);
	var inits = {
		scriptsToLoad : ["trackers/looking.time.client.js"],
		moduleName : "looking.time.tracker",
		outputToWriteInto : null,
		include : (function(trackInDetailWebs) {
			var include = [];
			for(var i = 0, ilen = trackInDetailWebs.length; i < ilen; i++) {
				include.push("*." + trackInDetailWebs[i].webRoot);
			}
			return include;
		})(trackInDetailWebs),
		onDeactivate : function(storage, console, self) {
			tabs.off("activate", handleOnActivate);
			tabs.off("ready", handleOnReady);
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
			_checkSaveRestart({
				url : data.url
			}, data.isTop);
			return;
		});
	};
	Tracker.call(this, props, inits);
	return this;
};

LookingTimeTracker.prototype = Object.create(Tracker);

module.exports = {
	LookingTimeTracker : LookingTimeTracker
};