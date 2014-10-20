var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var timer = require('sdk/timers');
var storage = require("./storage.js");
var console = require("./console.js");

module.exports = {
	init : function(props) {
		storage.init(props.getProp("sessionId"));
		console.init(props.getProp("sessionId"), moduleName);
		var workers = [];
		function detachWorker(worker, workerArray) {
			var index = workerArray.indexOf(worker);
			if(index != -1) {
				workerArray.splice(index, 1);
			}
			return;
		}
		////////////// ADDITIONAL INITIALIZATION ////////////////
		var scriptsToLoad = ["module.back.button.tracker/back.button.client.js"];
		var moduleName = "back.button.tracker";
		var outputToWriteInto = {
			"history.revisit" : moduleName + ".history.revisit"
		};
		var moduleData = {
			url : "no url"
		};
		var revisitationUrlStore = {
		};
		function customeOnDestroyLogic() {
			for(var i = 0, _keys = Object.keys(revisitationUrlStore), ilen = _keys.length; i < ilen; i++) {
				storage.addObj(outputToWriteInto["history.revisit"], {
					key : _keys[i],
					val : revisitationUrlStore[_keys[i]]
				});
			}
		}
		//----------- END ADDITIONAL INITIALIZATION //-----------
		// initialization block
		(function _init() {
			for(var i = 0, ilen = scriptsToLoad.length; i < ilen; i++) {
				scriptsToLoad[i] = self.data.url(scriptsToLoad[i]);
			}
			for(var i = 0, _keys = Object.keys(outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
				storage.registerOutput(outputToWriteInto[_keys[i]]);
			}
		})();
		// exports are below
		this.emitDone = function() {
			for(var i = 0, ilen = workers.length; i < ilen; i++) {
				workers[i].port.emit("done");
				workers[i].destroy();
			}
			customeOnDestroyLogic();
			return;
		};
		this.createModule = function(nextActivityCallback) {
			tabs.on("ready", function(tab) {
				if(tab.url == moduleData.url) {
					tab.on("close", function(tab) {
						if(!props.getProp("isTestDone")) {
							console.error("#530j3", "The main tab has been closed before the test end");
						}
					});
				}
			});
			var modulePageMode = pageMod.PageMod({
				//////////////  CONFIGURE THESE PROPERTIES //////////////
				include : "*",
				contentScriptFile : scriptsToLoad,
				contentScriptWhen : "ready",
				attachTo : ["top"],
				contentScriptOptions : {
					baseUrl : self.data.url(),
					folder : "module.back.button.tracker/",
					debug : props.getProp("debug")
				},
				//----------- END CONFIGURE THESE PROPERTIES //-----------
				onAttach : function(worker) {
					workers.push(worker);
					worker.on('detach', function() {
						detachWorker(this, workers);
					});
					worker.port.emit("init", "Hi There!");
					worker.port.on("error", function(err) {
						return console.error(err.errCode, err.str || err.toSource());
					});
					worker.port.on("next", function() {
						return nextActivityCallback();
					});
					worker.port.on("message", function(message) {
						return console.log(message);
					});
					//----------- ADD CUSTOM LISTENERS //-----------
					worker.port.on("history.revisit", function(data) {
						if(!revisitationUrlStore[data.baseUrl]) {
							revisitationUrlStore[data.baseUrl] = 1;
						} else {
							revisitationUrlStore[data.baseUrl]++;
						}
						return;
					});
					// TODO Add custom logic
					//----------- END ADD CUSTOM LISTENERS //-----------
				}
			});
			modulePageMode.on("error", function(err) {
				return console.error("qr7i1", err.toString());
			});
			return {
				openInTab : function(tabs) {
					console.error("geyze", "Module 'back.button.tracker' can't be loaded in a page.");
					return;
				},
				navigateInTab : function(tab) {
					console.error("geyze", "Module 'back.button.tracker' can't be loaded in a page.");
					return;
				}
			};
		};
		return this;
	}
};

