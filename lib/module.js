var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var selfExt = require("sdk/self");
var timer = require('sdk/timers');
var mergeFunc = require("sdk/util/object").merge;
var eventBroadcaster = require("./event.broadcaster.js");
var arrayUtil = require('sdk/util/array');

var _opts = {
	scriptsToLoad : ["script.js"],
	moduleName : "foo",
	outputToWriteInto : {
		"data.foo" : "hello.data.from.foo"
	},
	moduleData : {
		url : "foo.html",
		isPinned : false
	},
	emitDone : function(storage, console, self) {

	},
	moduleFolder : "/",
	onAttach : function(worker, storage, console, self) {

	},
	contentScriptOptions : {},
	pageModOptions : {}
};

module.exports = {
	Module : function(props, opts) {
		// options validation
		{
			this.opts = mergeFunc({}, _opts, opts);
			//this.opts = opts;
			if(!opts.moduleName) {
				throw new Error("#5ytsd Missing initializaton info: a module shall have a name.");
			}
			this.opts.outputToWriteInto = {};
			for(var i = 0, _keys = Object.keys(opts.outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
				this.opts.outputToWriteInto[_keys[i]] = this.opts.moduleName + "." + opts.outputToWriteInto[_keys[i]];
			}
			// data to open the module in a tab
			if(!this.opts.moduleData || !this.opts.moduleData.url) {
				throw new Error("#bnil7 Missing initalization info: a module shall be associated with a url to open.");
			}
			this.opts.moduleData.url = selfExt.data.url(this.opts.moduleData.url);
		}
		// End options validation
		var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
		var Console = require("./console.js").Console;
		var console = new Console(props.getProp("sessionId"), this.opts.moduleName);
		var workers = [];
		var thePageMod;
		for(var i = 0, ilen = this.opts.scriptsToLoad.length; i < ilen; i++) {
			this.opts.scriptsToLoad[i] = selfExt.data.url(this.opts.scriptsToLoad[i]);
		}
		for(var i = 0, _keys = Object.keys(this.opts.outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
			storage.registerOutput(this.opts.outputToWriteInto[_keys[i]]);
		}
		// exports are below//
		this.emitDone = (function() {
			var hasBeenDone = false;
			return function() {
				if(!hasBeenDone) {
					this.opts.emitDone(storage, console, this);
					for(var i = 0, ilen = workers.length; i < ilen; i++) {
						if(workers[i]) {
							workers[i].port.emit("done");
							workers[i].destroy();
						}
					}
					if(thePageMod) {
						thePageMod.destroy();
					}
				}
				hasBeenDone = true;
				return hasBeenDone;
			};
		})();
		this.createPage = function(nextActivityCallback) {
			var self = this;
			var pageModeOpts = {
				contentScriptFile : this.opts.scriptsToLoad,
				contentScriptWhen : "ready",
				include : this.opts.moduleData.url,
				contentScriptOptions : {
					baseUrl : selfExt.data.url(),
					folder : this.opts.moduleFolder,
					debug : props.getProp("debug")
				},
				onAttach : function(worker) {
		      arrayUtil.add(workers, worker);
		      worker.on('pageshow', function() { arrayUtil.add(workers, this); });
		      worker.on('pagehide', function() { arrayUtil.remove(workers, this); });
		      worker.on('detach', function() { arrayUtil.remove(workers, this); });
					// workers.push(worker);
					worker.port.on("test.flow.interrupted", function() {
						console.log("test.flow.interrupted RECEIVED");
						eventBroadcaster.emit("test.flow.interrupted");
						return;
					});
					// worker.port.on('detach', function() {
						// var worker = this;
						// var index = workers.indexOf(worker);
						// if(index != -1) {
							// workers[index] = null;
						// }
						// return;
					// });
					worker.port.emit("init", "Hi There!");
					worker.port.on("error", function(err) {
						return console.error(err.errCode, err.str || err.toSource());
					});
					worker.port.on("injected", function(scriptName) {
						//no-op;
					});
					worker.port.on("next", function() {
						self.emitDone();
						return nextActivityCallback();
					});
					worker.port.on("message", function(message) {
						return console.log(message);
					});
					self.opts.onAttach(worker, storage, console, self);
				}
			};
			pageModeOpts = mergeFunc(pageModeOpts, this.opts.pageModOptions);
			pageModeOpts.contentScriptOptions = mergeFunc(pageModeOpts.contentScriptOptions, this.opts.contentScriptOptions);
			thePageMod = pageMod.PageMod(pageModeOpts);
			thePageMod.on("error", function(err) {
				return console.error("7uoa9", err.toString());
			});
			return {
				openInTab : function(tabs) {
					tabs.open(self.opts.moduleData);
					return self;
				},
				navigateInTab : function(tab) {
					timer.setTimeout(function() {
						tab.url = self.opts.moduleData.url;
						return;
					}, 100);
					return self;
				}
			};
		};
		return this;
	}
};

