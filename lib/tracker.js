var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var selfExt = require("sdk/self");
var timer = require('sdk/timers');
var mergeFunc = require("sdk/util/object").merge;

var _opts = {
	scriptsToLoad : ["script.js"],
	moduleName : "foo",
	outputToWriteInto : {
		"data.foo" : "hello.data.from.foo"
	},
	include : "",
	onDeactivate : function(storage, console) {

	},
	moduleFolder : "/",
	onAttach : function(worker, storage, console, self) {

	},
	contentScriptOptions : {},
	pageModOptions : {},
	websitesToTrack: null,
	outpManager : {
		nameIndex : {},
		nameIndexIndex : {},
		getters : {
			"_default" : function(webRoot) {
			}
		}
	}
};

function constructOutpObj(moduleName, webRootArr) {
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
		tmpKeyStr1 = webRootArr[i].webRoot + "." + OUTPUT;
		nameIndex[tmpKeyStr1] = moduleName + "." + tmpKeyStr1;
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
				for(var i = 0, _keys = Object.keys(_outpObj.nameIndexVisit), ilen = _keys.length; i < ilen; i++) {
					if(webRoot.indexOf(_keys[i]) != -1) {
						return _outpObj.nameIndexVisit[_keys[i]];
					}
				}
				return "";
			}
		}
	};
	return _outpObj;
}

module.exports = {
	Tracker : function(props, opts) {
		// options validation
		{
			this.opts = mergeFunc({}, _opts, opts);
			//this.opts = opts;
			if(!opts.moduleName) {
				throw new Error("#5ytsd Missing initializaton info: a module shall have a name.");
			}
			var outpManager = opts.outpManager || constructOutpObj(opts.moduleName, opts.websitesToTrack);
			this.opts.outputToWriteInto = outpManager.nameIndex;
		}
		var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
		var console = new (require("./console.js").Console)(props.getProp("sessionId"), this.opts.moduleName);
		var workers = [];
		var thePageMod;
		// End options validation
		for(var i = 0, ilen = this.opts.scriptsToLoad.length; i < ilen; i++) {
			this.opts.scriptsToLoad[i] = selfExt.data.url(this.opts.scriptsToLoad[i]);
		}
		for(var i = 0, _keys = Object.keys(this.opts.outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
			storage.registerOutput(this.opts.outputToWriteInto[_keys[i]]);
		}
		// exports are below//
		this._getOutpNameByHostname = function(hostname, getterName) {
			getterName = getterName || "_default";
			return outpManager.getters[getterName](hostname);
		};
		this.deactivate = function() {
			this.opts.onDeactivate(storage, console, this);
			for(var i = 0, ilen = workers.length; i < ilen; i++) {
				if(workers[i]) {
					workers[i].port.emit("done");
					workers[i].destroy();
				}
			}
			if(thePageMod) {
				thePageMod.destroy();
			}
			return;
		};
		this.activate = function(nextActivityCallback) {
			var self = this;
			var pageModeOpts = {
				contentScriptFile : this.opts.scriptsToLoad,
				contentScriptWhen : "ready",
				include : this.opts.include,
				contentScriptOptions : {
					baseUrl : selfExt.data.url(),
					folder : this.opts.moduleFolder,
					debug : props.getProp("debug")
				},
				onAttach : function(worker) {
					workers.push(worker);
					worker.on('detach', function() {
						var worker = this;
						var index = workers.indexOf(worker);
						if(index != -1) {
							workers[index] = null;
						}
						return;
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
					self.opts.onAttach(worker, storage, console, self);
				}
			};
			pageModeOpts = mergeFunc(pageModeOpts, this.opts.pageModOptions);
			pageModeOpts.contentScriptOptions = mergeFunc(pageModeOpts.contentScriptOptions, this.opts.contentScriptOptions);
			thePageMod = pageMod.PageMod(pageModeOpts);
			thePageMod.on("error", function(err) {
				return console.error("qr7i1", err.toString());
			});
			return pageModeOpts.include;
		};
		return this;
	}
};

